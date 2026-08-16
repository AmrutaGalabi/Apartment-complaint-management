const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));


// =====================================
// TEMPORARY DATABASE
// =====================================

let complaints = [
    {
        id: 1,
        residentName: "Amruta",
        roomNumber: "A-101",
        contact: "9876543210",
        category: "Water Supply",
        description: "Water supply is not working properly.",
        date: "2026-08-16",
        priority: "High",
        status: "Pending",
        additionalInfo: "Please check the pipeline."
    }
];

let nextId = 2;


// =====================================
// GET ALL COMPLAINTS
// =====================================

app.get("/api/complaints", (req, res) => {

    res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
    });

});


// =====================================
// GET SINGLE COMPLAINT
// =====================================

app.get("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(
        complaint => complaint.id === id
    );

    if (!complaint) {

        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });

    }

    res.status(200).json({
        success: true,
        data: complaint
    });

});


// =====================================
// GET STATUS SUMMARY
// =====================================

app.get("/api/status", (req, res) => {

    const statusSummary = {

        total: complaints.length,

        pending: complaints.filter(
            complaint =>
                complaint.status === "Pending"
        ).length,

        inProgress: complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length,

        resolved: complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length,

        cancelled: complaints.filter(
            complaint =>
                complaint.status === "Cancelled"
        ).length

    };


    res.status(200).json({

        success: true,

        message: "Complaint status summary",

        data: statusSummary

    });

});


// =====================================
// POST - CREATE COMPLAINT
// =====================================

app.post("/api/complaints", (req, res) => {

    console.log("POST request received");

    console.log(req.body);


    const {

        residentName,
        roomNumber,
        contact,
        category,
        description,
        date,
        priority,
        additionalInfo

    } = req.body;


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!residentName) {

        return res.status(400).json({

            success: false,

            message:
                "Resident name is required"

        });

    }


    if (!roomNumber) {

        return res.status(400).json({

            success: false,

            message:
                "Room / Flat number is required"

        });

    }


    if (
        !contact ||
        !/^[0-9]{10}$/.test(contact)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Enter a valid 10 digit contact number"

        });

    }


    if (!category) {

        return res.status(400).json({

            success: false,

            message:
                "Complaint category is required"

        });

    }


    if (!description) {

        return res.status(400).json({

            success: false,

            message:
                "Complaint description is required"

        });

    }


    if (!priority) {

        return res.status(400).json({

            success: false,

            message:
                "Priority is required"

        });

    }


    // -------------------------------
    // CREATE COMPLAINT
    // -------------------------------

    const newComplaint = {

        id: nextId++,

        residentName:
            residentName.trim(),

        roomNumber:
            roomNumber.trim(),

        contact:
            contact.trim(),

        category:
            category,

        description:
            description.trim(),

        date:
            date ||
            new Date()
                .toISOString()
                .split("T")[0],

        priority:
            priority,

        status:
            "Pending",

        additionalInfo:
            additionalInfo
                ? additionalInfo.trim()
                : ""

    };


    complaints.push(newComplaint);


    console.log(
        "New complaint:",
        newComplaint
    );


    res.status(201).json({

        success: true,

        message:
            "Complaint submitted successfully",

        data:
            newComplaint

    });

});


// =====================================
// PUT - EDIT COMPLAINT
// =====================================

app.put("/api/complaints/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const index =
        complaints.findIndex(
            complaint =>
                complaint.id === id
        );


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message:
                "Complaint not found"

        });

    }


    const {

        residentName,
        roomNumber,
        contact,
        category,
        description,
        priority,
        additionalInfo

    } = req.body;


    // Validation

    if (residentName !== undefined &&
        !residentName.trim()) {

        return res.status(400).json({

            success: false,

            message:
                "Resident name cannot be empty"

        });

    }


    if (roomNumber !== undefined &&
        !roomNumber.trim()) {

        return res.status(400).json({

            success: false,

            message:
                "Room number cannot be empty"

        });

    }


    if (
        contact !== undefined &&
        !/^[0-9]{10}$/.test(contact)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Enter a valid 10 digit contact number"

        });

    }


    // Update

    complaints[index] = {

        ...complaints[index],

        ...req.body,

        id:
            complaints[index].id

    };


    res.status(200).json({

        success: true,

        message:
            "Complaint updated successfully",

        data:
            complaints[index]

    });

});


// =====================================
// PUT - UPDATE STATUS
// =====================================

app.put(
    "/api/complaints/:id/status",
    (req, res) => {

        const id =
            Number(req.params.id);


        const complaint =
            complaints.find(
                complaint =>
                    complaint.id === id
            );


        if (!complaint) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found"

            });

        }


        const { status } =
            req.body;


        const validStatuses = [

            "Pending",

            "In Progress",

            "Resolved",

            "Cancelled"

        ];


        if (
            !validStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid status. Use Pending, In Progress, Resolved or Cancelled."

            });

        }


        complaint.status =
            status;


        res.status(200).json({

            success: true,

            message:
                "Complaint status updated successfully",

            data:
                complaint

        });

    }
);


// =====================================
// DELETE COMPLAINT
// =====================================

app.delete(
    "/api/complaints/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        const index =
            complaints.findIndex(
                complaint =>
                    complaint.id === id
            );


        if (index === -1) {

            return res.status(404).json({

                success: false,

                message:
                    "Complaint not found"

            });

        }


        const deletedComplaint =
            complaints.splice(
                index,
                1
            );


        res.status(200).json({

            success: true,

            message:
                "Complaint deleted successfully",

            data:
                deletedComplaint[0]

        });

    }
);


// =====================================
// DEFAULT ROUTE
// =====================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log("");
    console.log(
        "===================================="
    );

    console.log(
        "       STAYCARE SYSTEM"
    );

    console.log(
        "===================================="
    );

    console.log(
        `Server running at: http://localhost:${PORT}`
    );

    console.log(
        "===================================="
    );

});