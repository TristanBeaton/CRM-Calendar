import Express from "express";
import Axios from "axios";
import Moment from "moment";
import ical from "ical-generator";
import pkg from 'lodash';
const { groupBy } = pkg;

const app = Express();

Axios.defaults.validateStatus = function() {
    return true;
  };

/**
 * 
 * Activate CRM License and return sample share link
 */
app.get("/login", async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    if (email === undefined || email === "") {
        throw Error("Email is required.");
    }
    if (password === undefined || password === "") {
        throw Error("Password in required");
    }
    const headers = {
        "headers": {
            "Content-Type": "application/json"
        }
    }
    const payload = {
        "username": email,
        "password": password,
        "appID": "crm",
        "existingDeviceBehavior": 1
    }
    const loginResponse = await Axios.post("https://api.measureflooring.com/api/checkout/activate", payload, headers);
    if (loginResponse.status === 200) {
        const userData = loginResponse.data;
        let token = userData.PartitionKey;
        res.send(`http://localhost:5000/calendar/${token}?salesperson=${userData.Email}&df=30&db=7`);
    } else {
        res.send(loginResponse.data);
    }
})

/**
 * 
 * This returns a Calendar with the basic appointment data. No opportunity details included.
 */

app.get("/calendar/:token", async (req, res) => {
    let salespersons = []
    if (typeof (req.query.salesperson) === "undefined") { } else
        if (typeof (req.query.salesperson) === "string") {
            salespersons = [req.query.salesperson];
        } else {
            salespersons = req.query.salesperson;
        }

    let daysBefore = 14
    let daysForward = 90
    if (typeof (req.query.db) == "number") {
        daysForward = req.query.db;
    }
    if (typeof (req.query.df) == "number") {
        daysForward = req.query.df;
    }
    const headers = {
        "headers": {
            "Token": req.params.token,
            "Content-Type": "application/json"
        }
    }
    const payload = {
        "assigned": salespersons,
        "type": "Appointment",
        "startDate": Moment().utc().subtract(daysBefore, "days").format(), //"0001-01-01T00:00:00Z",
        "endDate": Moment().utc().add(daysForward, "days").format(), //"2099-01-01T00:00:00Z"
    }
    console.log(payload);
    const activitiesResponse = await Axios.post("https://api.measureflooring.com/api/calendar/search", payload, headers);
    const activities = Array.from(activitiesResponse.data)
    const calendar = ical({ name: `CRM (${salespersons.join(' ')})` });
    activities.forEach((act) => {
        calendar.createEvent({
            start: Moment(act.startTime),
            end: Moment(act.endTime),
            summary: `${act.subject.toUpperCase()} - ${act.opportunityName}`,
            description: `Assigned to: ${act.assigned}\n${act.details}`,
            categories: [{ name: `${act.assigned}` }]
        })
    })
    console.log("finished");
    res.send(calendar.toString());
})

/**
 * 
 * Calendar link with customer phone email and address.
 * This link is slower with all the extra calls to the RFMS API
 */

app.get("/calendar/deep/:token", async (req, res) => {
    try {
        let salespersons = []
        if (typeof (req.query.salesperson) === "undefined") { } else
            if (typeof (req.query.salesperson) === "string") {
                salespersons = [req.query.salesperson];
            } else {
                salespersons = req.query.salesperson;
            }

        let daysBefore = 7;
        let daysForward = 30;
        if (typeof (req.query.db) == "number") {
            daysForward = req.query.db;
        }
        if (typeof (req.query.df) == "number") {
            daysForward = req.query.df;
        }
        const headers = {
            "headers": {
                "Token": req.params.token,
                "Content-Type": "application/json"
            }
        }
        const payload = {
            "assigned": salespersons,
            "type": "Appointment",
            "startDate": Moment().utc().subtract(daysBefore, "days").format(), //"0001-01-01T00:00:00Z",
            "endDate": Moment().utc().add(daysForward, "days").format(), //"2099-01-01T00:00:00Z"
        }
        const activitiesResponse = await Axios.post("https://api.measureflooring.com/api/calendar/search", payload, headers);
        const activities = Array.from(activitiesResponse.data)
        const calendar = ical({ name: `Measure Appointments (${salespersons.join(' ')})` });
        for (const act of activities) {
            try {
                const op_rep = await Axios.get(`https://api.measureflooring.com/api/opportunity/${act.opportunityId}`, headers);
                if (op_rep.status === 200) {
                    const op = op_rep.data;
                    const customer = op.customer;
                    let event = calendar.createEvent({
                        start: Moment(act.startTime),
                        end: Moment(act.endTime),
                        summary: `MEASURE - ${customer.customerFirstName} ${customer.customerName}`,
                        location: `${customer.jobAddress} ${customer.jobAddress2} ${customer.jobCity} ${customer.jobState} ${customer.jobZIP}`,
                        categories: [{ name: `${act.assigned}` }]
                    });
                }
            } catch (axiosError) {
                calendar.createEvent({
                    start: Moment(act.startTime),
                    end: Moment(act.endTime),
                    summary: `${act.subject.toUpperCase()} - ${act.opportunityName}`,
                    description: `Assigned to: ${act.assigned}\n${act.details}`,
                    categories: [{ name: `${act.assigned}` }]
                })
            }
        }
        console.log("finished");
        res.status(200).send(calendar.toString());
    } catch {
        res.status(500)
    }
})

/**
 * 
 * Calendar link with customer details. Only works if their is a Measure project associated with the opportunity.
 * This link is reasonably fast but is dependant on there being a Measure project to get customer details.
 */

app.get("/calendar/measure/:token", async (req, res) => {
    try {
        let salespersons = []
        if (typeof (req.query.salesperson) === "undefined") { } else
            if (typeof (req.query.salesperson) === "string") {
                salespersons = [req.query.salesperson];
            } else {
                salespersons = req.query.salesperson;
            }
        const headers = {
            "headers": {
                "Token": req.params.token,
                "Content-Type": "application/json"
            }
        }
        const payload = {
            "assigned": salespersons,
            "type": "Appointment",
            "startDate": Moment().utc().subtract(14, "days").format(), //"0001-01-01T00:00:00Z",
            "endDate": Moment().utc().add(90, "days").format(), //"2099-01-01T00:00:00Z"
        }
        const activitiesResponse = await Axios.post("https://api.measureflooring.com/api/calendar/search", payload, headers);
        const activities = Array.from(activitiesResponse.data)
        const ids = activities.map((act) => { return act.opportunityId })
        const projectsResponse = await Axios.post("https://api.measureflooring.com/api/opportunity/drawing", ids, headers);
        const projects = Array.from(projectsResponse.data);
        let indexed = groupBy(projects, (p) => { return p.opportunityId });
        const calendar = ical({ name: `Measure Appointments (${salespersons.join(' ')})` });
        activities.forEach((act) => {
            const projs = indexed[act.opportunityId];
            if (projs != undefined) {
                const proj = Array.from(projs)[0];;
                let event = calendar.createEvent({
                    start: Moment(act.startTime),
                    end: Moment(act.endTime),
                    summary: `MEASURE - ${proj.customerFirstName} ${proj.customerName}`,
                    location: `${proj.jobAddress} ${proj.jobAddress2} ${proj.jobCity} ${proj.jobState} ${proj.jobZIP}`,
                    categories: [{ name: `${act.assigned}` }]
                })
            }
        })
        console.log("finished");
        res.status(200).send(calendar.toString());
    } catch {
        res.status(500)
    }
})

app.listen(5000, () => console.log("Listening on port 5000."));