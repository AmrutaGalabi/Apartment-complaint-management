// =====================================
// GLOBAL DATA
// =====================================

let allComplaints = [];


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTodayDate();

        loadComplaints();

    }
);


// =====================================
// SET TODAY'S DATE
// =====================================

function setTodayDate() {

    document.getElementById(
        "date"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];

}


// =====================================
// POST - CREATE COMPLAINT
// =====================================

document.getElementById(
    "complaintForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const data = {

            residentName:
                document.getElementById(
                    "residentName"
                ).value.trim(),

            roomNumber:
                document.getElementById(
                    "roomNumber"
                ).value.trim(),

            contact:
                document.getElementById(
                    "contact"
                ).value.trim(),

            category:
                document.getElementById(
                    "category"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value.trim(),

            date:
                document.getElementById(
                    "date"
                ).value,

            priority:
                document.getElementById(
                    "priority"
                ).value,

            additionalInfo:
                document.getElementById(
                    "additionalInfo"
                ).value.trim()

        };


        // Frontend validation

        if (
            !/^[0-9]{10}$/.test(
                data.contact
            )
        ) {

            showMessage(
                "Please enter a valid 10 digit contact number.",
                "error"
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/complaints",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                showMessage(
                    result.message,
                    "error"
                );

                return;

            }


            showMessage(
                "Complaint submitted successfully!",
                "success"
            );


            document.getElementById(
                "complaintForm"
            ).reset();


            setTodayDate();


            loadComplaints();

        }

        catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to server. Make sure server.js is running.",
                "error"
            );

        }

    }
);


// =====================================
// GET - LOAD COMPLAINTS
// =====================================

async function loadComplaints() {

    try {

        const response =
            await fetch(
                "/api/complaints"
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Unable to load complaints"
            );

        }


        allComplaints =
            result.data;


        displayComplaints(
            allComplaints
        );


        updateStatistics(
            allComplaints
        );

    }

    catch (error) {

        console.error(error);


        document.getElementById(
            "complaintList"
        ).innerHTML = `

            <div class="complaint">

                ❌ Unable to connect to server.

                <br><br>

                Start the server using:

                <br><br>

                <b>
                    node server.js
                </b>

            </div>

        `;

    }

}


// =====================================
// DISPLAY COMPLAINTS
// =====================================

function displayComplaints(
    complaints
) {

    const list =
        document.getElementById(
            "complaintList"
        );


    if (
        complaints.length === 0
    ) {

        list.innerHTML = `

            <div class="complaint">

                📭 No complaints found.

            </div>

        `;

        return;

    }


    list.innerHTML =
        complaints
            .map(
                complaint => {

                    let statusClass =
                        complaint.status
                            .toLowerCase()
                            .replace(
                                " ",
                                "-"
                            );


                    if (
                        complaint.status ===
                        "In Progress"
                    ) {

                        statusClass =
                            "progress";

                    }


                    return `

                    <div class="complaint">

                        <div class="complaint-top">

                            <h3>

                                #${complaint.id}

                                -

                                ${escapeHTML(
                                    complaint.category
                                )}

                            </h3>


                            <span
                                class="badge ${statusClass}"
                            >

                                ${escapeHTML(
                                    complaint.status
                                )}

                            </span>

                        </div>



                        <div class="complaint-info">


                            <div class="info-box">

                                <small>
                                    RESIDENT
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        complaint.residentName
                                    )}
                                </strong>

                            </div>



                            <div class="info-box">

                                <small>
                                    ROOM
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        complaint.roomNumber
                                    )}
                                </strong>

                            </div>



                            <div class="info-box">

                                <small>
                                    PRIORITY
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        complaint.priority
                                    )}
                                </strong>

                            </div>



                            <div class="info-box">

                                <small>
                                    CONTACT
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        complaint.contact
                                    )}
                                </strong>

                            </div>



                            <div class="info-box">

                                <small>
                                    DATE
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        complaint.date
                                    )}
                                </strong>

                            </div>


                        </div>



                        <div class="description">

                            <strong>
                                Description:
                            </strong>

                            <br>

                            ${escapeHTML(
                                complaint.description
                            )}

                        </div>



                        ${
                            complaint.additionalInfo
                            ?
                            `
                            <div class="description">

                                <strong>
                                    Additional Info:
                                </strong>

                                ${escapeHTML(
                                    complaint.additionalInfo
                                )}

                            </div>
                            `
                            :
                            ""
                        }



                        <div class="actions">


                            <button
                                class="action-btn edit-btn"
                                onclick="
                                    openEditModal(
                                        ${complaint.id}
                                    )
                                "
                            >

                                ✏️ Edit

                            </button>



                            <button
                                class="action-btn status-btn"
                                onclick="
                                    changeStatus(
                                        ${complaint.id}
                                    )
                                "
                            >

                                🔄 Status

                            </button>



                            <button
                                class="action-btn delete-btn"
                                onclick="
                                    deleteComplaint(
                                        ${complaint.id}
                                    )
                                "
                            >

                                🗑️ Delete

                            </button>


                        </div>


                    </div>

                    `;

                }
            )
            .join("");

}


// =====================================
// GET SINGLE COMPLAINT
// =====================================

async function openEditModal(id) {

    try {

        const response =
            await fetch(
                `/api/complaints/${id}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message
            );

            return;

        }


        const complaint =
            result.data;


        document.getElementById(
            "editId"
        ).value =
            complaint.id;


        document.getElementById(
            "editResidentName"
        ).value =
            complaint.residentName;


        document.getElementById(
            "editRoomNumber"
        ).value =
            complaint.roomNumber;


        document.getElementById(
            "editContact"
        ).value =
            complaint.contact;


        document.getElementById(
            "editCategory"
        ).value =
            complaint.category;


        document.getElementById(
            "editDescription"
        ).value =
            complaint.description;


        document.getElementById(
            "editPriority"
        ).value =
            complaint.priority;


        document.getElementById(
            "editAdditionalInfo"
        ).value =
            complaint.additionalInfo;


        document.getElementById(
            "editModal"
        ).classList.add(
            "active"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load complaint."
        );

    }

}


// =====================================
// CLOSE EDIT MODAL
// =====================================

function closeEditModal() {

    document.getElementById(
        "editModal"
    ).classList.remove(
        "active"
    );

}


// =====================================
// PUT - EDIT COMPLAINT
// =====================================

document.getElementById(
    "editForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "editId"
            ).value;


        const data = {

            residentName:
                document.getElementById(
                    "editResidentName"
                ).value.trim(),

            roomNumber:
                document.getElementById(
                    "editRoomNumber"
                ).value.trim(),

            contact:
                document.getElementById(
                    "editContact"
                ).value.trim(),

            category:
                document.getElementById(
                    "editCategory"
                ).value,

            description:
                document.getElementById(
                    "editDescription"
                ).value.trim(),

            priority:
                document.getElementById(
                    "editPriority"
                ).value,

            additionalInfo:
                document.getElementById(
                    "editAdditionalInfo"
                ).value.trim()

        };


        if (
            !/^[0-9]{10}$/.test(
                data.contact
            )
        ) {

            alert(
                "Enter valid 10 digit contact number."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `/api/complaints/${id}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message
                );

                return;

            }


            alert(
                "Complaint updated successfully!"
            );


            closeEditModal();


            loadComplaints();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to update complaint."
            );

        }

    }
);


// =====================================
// DELETE COMPLAINT
// =====================================

async function deleteComplaint(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this complaint?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/complaints/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message
            );

            return;

        }


        alert(
            "Complaint deleted successfully!"
        );


        loadComplaints();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete complaint."
        );

    }

}


// =====================================
// UPDATE STATUS
// =====================================

async function changeStatus(id) {

    const status =
        prompt(
            "Enter new status:\n\n" +
            "Pending\n" +
            "In Progress\n" +
            "Resolved\n" +
            "Cancelled"
        );


    if (!status) {

        return;

    }


    const validStatuses = [

        "Pending",

        "In Progress",

        "Resolved",

        "Cancelled"

    ];


    if (
        !validStatuses.includes(
            status
        )
    ) {

        alert(
            "Invalid status."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/complaints/${id}/status`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            status: status
                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message
            );

            return;

        }


        alert(
            "Status updated successfully!"
        );


        loadComplaints();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to update status."
        );

    }

}


// =====================================
// SEARCH AND FILTER
// =====================================

function filterComplaints() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filtered =
        allComplaints.filter(
            complaint => {


                const matchesSearch =

                    complaint.residentName
                        .toLowerCase()
                        .includes(search)

                    ||

                    complaint.roomNumber
                        .toLowerCase()
                        .includes(search)

                    ||

                    complaint.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    complaint.description
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    !status ||
                    complaint.status ===
                    status;


                const matchesCategory =
                    !category ||
                    complaint.category ===
                    category;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory
                );

            }
        );


    displayComplaints(
        filtered
    );

}


// =====================================
// UPDATE DASHBOARD STATISTICS
// =====================================

function updateStatistics(
    complaints
) {

    document.getElementById(
        "totalComplaints"
    ).textContent =
        complaints.length;


    document.getElementById(
        "pendingComplaints"
    ).textContent =
        complaints.filter(
            complaint =>
                complaint.status ===
                "Pending"
        ).length;


    document.getElementById(
        "progressComplaints"
    ).textContent =
        complaints.filter(
            complaint =>
                complaint.status ===
                "In Progress"
        ).length;


    document.getElementById(
        "resolvedComplaints"
    ).textContent =
        complaints.filter(
            complaint =>
                complaint.status ===
                "Resolved"
        ).length;

}


// =====================================
// SUCCESS / ERROR MESSAGE
// =====================================

function showMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "message"
        );


    messageBox.textContent =
        message;


    messageBox.className =
        type;


    setTimeout(
        function () {

            messageBox.className =
                "";

            messageBox.textContent =
                "";

        },
        4000
    );

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}