(function () {
    "use strict";

    const STORAGE_KEY = "schoolcare_complaints";
    const STUDENT_SESSION_KEY = "schoolcare_student_session";
    const OFFICE_SESSION_KEY = "schoolcare_office_session";
    const STAFF_KEY = "schoolcare_staff";

    const students = [
        {
            id: "2026-0001",
            password: "student123",
            name: "Hannah Kim",
            department: "BS Computer Science",
            gender: "Female"
        },
        {
            id: "2026-0002",
            password: "student123",
            name: "TJ Han",
            department: "BS Information Technology",
            gender: "Male"
        },
        {
            id: "2026-0003",
            password: "student123",
            name: "Pauline C.",
            department: "BS Computer Science",
            gender: "Female"
        },
        {
            id: "2026-0004",
            password: "student123",
            name: "Ethan lee",
            department: "BS Information Technology",
            gender: "Male"
        },
        {
            id: "2026-0005",
            password: "student123",
            name: "Deverly R.",
            department: "BS Computer Science",
            gender: "Female"
        },
        {
            id: "2026-0006",
            password: "student123",
            name: "Jhenna M.",
            department: "BS Information Technology",
            gender: "Male"
        }
    ];

    const officeAccounts = [
        {
            id: "OFFICE-001",
            password: "office123",
            name: "SchoolCare Administrator"
        }
    ];

    let currentStudent = null;
    let currentComplaintId = null;

    const $ = function (id) {
        return document.getElementById(id);
    };

    function getComplaints() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);

            if (!data) {
                return [];
            }

            const parsed = JSON.parse(data);

            if (!Array.isArray(parsed)) {
                return [];
            }

            let changed = false;

            parsed.forEach(function (complaint) {
                if (!complaint.lastUpdatedAt) {
                    complaint.lastUpdatedAt =
                        complaint.submittedAt || new Date().toISOString();
                    changed = true;
                }

                if (!Array.isArray(complaint.updateHistory)) {
                    complaint.updateHistory = [
                        {
                            status: complaint.status || "Pending",
                            date:
                                complaint.lastUpdatedAt ||
                                complaint.submittedAt ||
                                new Date().toISOString(),
                            staff: complaint.maintenanceStaff || "",
                            notes: complaint.resolutionNotes || ""
                        }
                    ];

                    changed = true;
                }
            });

            if (changed) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(parsed)
                );
            }

            return parsed;
        } catch (error) {
            return [];
        }
    }

    function saveComplaints(complaints) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(complaints)
        );
    }

    function getStaff() {
        try {
            const data = localStorage.getItem(STAFF_KEY);

            if (!data) {
                return [
                    {
                        id: "STAFF-001",
                        name: "Maintenance Staff 1",
                        position: "Maintenance Staff"
                    },
                    {
                        id: "STAFF-002",
                        name: "Maintenance Staff 2",
                        position: "Maintenance Staff"
                    }
                ];
            }

            const parsed = JSON.parse(data);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveStaff(staff) {
        localStorage.setItem(
            STAFF_KEY,
            JSON.stringify(staff)
        );
    }

    function getStudentSession() {
        try {
            const data =
                sessionStorage.getItem(STUDENT_SESSION_KEY);

            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    function getOfficeSession() {
        try {
            const data =
                sessionStorage.getItem(OFFICE_SESSION_KEY);

            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    function setStudentSession(student) {
        sessionStorage.setItem(
            STUDENT_SESSION_KEY,
            JSON.stringify(student)
        );

        sessionStorage.removeItem(
            OFFICE_SESSION_KEY
        );
    }

    function setOfficeSession(office) {
        sessionStorage.setItem(
            OFFICE_SESSION_KEY,
            JSON.stringify(office)
        );

        sessionStorage.removeItem(
            STUDENT_SESSION_KEY
        );
    }

    function clearSessions() {
        sessionStorage.removeItem(
            STUDENT_SESSION_KEY
        );

        sessionStorage.removeItem(
            OFFICE_SESSION_KEY
        );
    }

    function showLogin() {
        $("loginPage").classList.remove("hidden");
        $("studentPortal").classList.add("hidden");
        $("officePortal").classList.add("hidden");
    }

    function showStudentPortal() {
        $("loginPage").classList.add("hidden");
        $("officePortal").classList.add("hidden");
        $("studentPortal").classList.remove("hidden");

        showStudentPage("studentDashboard");

        updateStudentInterface();
        renderStudentDashboard();
        renderStudentComplaints();
        updateStudentDateTime();
        updateStudentNotifications();
    }

    function showOfficePortal() {
        $("loginPage").classList.add("hidden");
        $("studentPortal").classList.add("hidden");
        $("officePortal").classList.remove("hidden");

        showAdminPage("adminDashboard");

        updateOfficeInterface();
        renderAdminDashboard();
        renderAllComplaints();
        renderMaintenance();
        renderStaff();
        renderReports();
        updateOfficeNotifications();
    }

    function showStudentPage(pageId) {
        const pages =
            document.querySelectorAll(".student-page");

        const buttons =
            document.querySelectorAll(
                "[data-student-page]"
            );

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });

        buttons.forEach(function (button) {
            button.classList.remove("active");
        });

        const target = $(pageId);

        if (target) {
            target.classList.add("active-page");
        }

        buttons.forEach(function (button) {
            if (
                button.getAttribute(
                    "data-student-page"
                ) === pageId
            ) {
                button.classList.add("active");
            }
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (pageId === "submitComplaintPage") {
            updateComplaintForm();
        }

        if (pageId === "trackComplaintsPage") {
            renderStudentComplaints();
        }
    }

    function showAdminPage(pageId) {
        const pages =
            document.querySelectorAll(".admin-page");

        const buttons =
            document.querySelectorAll(
                "[data-admin-page]"
            );

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });

        buttons.forEach(function (button) {
            button.classList.remove("active");
        });

        const target = $(pageId);

        if (target) {
            target.classList.add("active-page");
        }

        buttons.forEach(function (button) {
            if (
                button.getAttribute(
                    "data-admin-page"
                ) === pageId
            ) {
                button.classList.add("active");
            }
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (pageId === "adminDashboard") {
            renderAdminDashboard();
        }

        if (pageId === "allComplaintsPage") {
            renderAllComplaints();
        }

        if (pageId === "maintenancePage") {
            renderMaintenance();
        }

        if (pageId === "staffPage") {
            renderStaff();
        }

        if (pageId === "reportsPage") {
            renderReports();
        }
    }

    function updateStudentInterface() {
        if (!currentStudent) {
            return;
        }

        const firstName =
            currentStudent.name.split(" ")[0];

        const initial =
            currentStudent.name.charAt(0).toUpperCase();

        $("studentHeaderName").textContent =
            currentStudent.name;

        $("studentHeaderId").textContent =
            currentStudent.id;

        $("studentWelcomeName").textContent =
            firstName;

        $("studentAvatarInitial").textContent =
            initial;

        $("dashboardStudentName").textContent =
            currentStudent.name;

        $("dashboardStudentId").textContent =
            currentStudent.id;

        $("dashboardStudentDepartment").textContent =
            currentStudent.department;

        $("profileAvatarInitial").textContent =
            initial;

        $("profileStudentName").textContent =
            currentStudent.name;

        $("profileName").textContent =
            currentStudent.name;

        $("profileStudentId").textContent =
            currentStudent.id;

        $("profileDepartment").textContent =
            currentStudent.department;

        updateComplaintForm();
    }

    function updateOfficeInterface() {
        const office = getOfficeSession();

        if (!office) {
            return;
        }

        $("officeHeaderUsername").textContent =
            office.id;
    }

    function updateComplaintForm() {
        if (!currentStudent) {
            return;
        }

        $("complaintStudentName").value =
            currentStudent.name;

        $("complaintStudentId").value =
            currentStudent.id;

        $("complaintStudentDepartment").value =
            currentStudent.department;

        const now = new Date();

        $("complaintSubmissionDate").textContent =
            formatDate(now);

        $("complaintSubmissionTime").textContent =
            formatTime(now);
    }

    function formatDate(date) {
        if (!(date instanceof Date) ||
            isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function formatTime(date) {
        if (!(date instanceof Date) ||
            isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    function formatDateTime(dateString) {
        if (!dateString) {
            return "-";
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "-";
        }

        return formatDate(date) +
            " • " +
            formatTime(date);
    }

    function generateComplaintId() {
        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        return (
            "SC-" +
            new Date().getFullYear() +
            "-" +
            random
        );
    }

    function escapeHTML(value) {
        const div =
            document.createElement("div");

        div.textContent =
            value == null ? "" : String(value);

        return div.innerHTML;
    }

    function getStatusClass(status) {
        if (status === "Acknowledged") {
            return "status-acknowledged";
        }

        if (status === "In Progress") {
            return "status-progress";
        }

        if (status === "Resolved") {
            return "status-resolved";
        }

        return "status-pending";
    }

    function getStatusText(status) {
        return status || "Pending";
    }

    function getStatusDescription(status) {
        if (status === "Acknowledged") {
            return "Your complaint has been reviewed by the office.";
        }

        if (status === "In Progress") {
            return "Maintenance is currently handling the issue.";
        }

        if (status === "Resolved") {
            return "The reported issue has been resolved.";
        }

        return "Your complaint has been received and is waiting for review.";
    }

    function showConfirmation(complaint) {
        $("confirmationTitle").textContent =
            "Complaint Submitted";

        $("confirmationMessage").textContent =
            "Your complaint has been submitted successfully.";

        $("confirmationComplaintId").textContent =
            "Complaint ID: " + complaint.id;

        openModal("confirmationModal");
    }

    function submitComplaint(event) {
        event.preventDefault();

        if (!currentStudent) {
            alert(
                "Please sign in as a student first."
            );

            return;
        }

        const subject =
            $("complaintSubject").value.trim();

        const location =
            $("complaintLocation").value.trim();

        const description =
            $("complaintDescription").value.trim();

        if (
            !subject ||
            !location ||
            !description
        ) {
            alert(
                "Please complete all required complaint fields."
            );

            return;
        }

        const now = new Date();
        const nowISO = now.toISOString();

        const complaint = {
            id: generateComplaintId(),

            studentId:
                currentStudent.id,

            studentName:
                currentStudent.name,

            department:
                currentStudent.department,

            subject:
                subject,

            location:
                location,

            description:
                description,

            status:
                "Pending",

            maintenanceStaff:
                "",

            resolutionNotes:
                "",

            submittedAt:
                nowISO,

            lastUpdatedAt:
                nowISO,

            lastUpdatedBy:
                "Student",

            resolvedAt:
                null,

            updateHistory: [
                {
                    status: "Pending",
                    date: nowISO,
                    staff: "",
                    notes: ""
                }
            ]
        };

        const complaints =
            getComplaints();

        complaints.unshift(
            complaint
        );

        saveComplaints(
            complaints
        );

        $("studentComplaintForm").reset();

        updateComplaintForm();

        renderStudentDashboard();
        renderStudentComplaints();

        renderAdminDashboard();
        renderAllComplaints();
        renderMaintenance();
        renderReports();

        updateStudentNotifications();
        updateOfficeNotifications();

        showConfirmation(
            complaint
        );
    }

    function renderStudentDashboard() {
        if (!currentStudent) {
            return;
        }

        const complaints =
            getComplaints().filter(
                function (complaint) {
                    return (
                        complaint.studentId ===
                        currentStudent.id
                    );
                }
            );

        const total =
            complaints.length;

        const pending =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Pending"
                    );
                }
            ).length;

        const progress =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "In Progress"
                    );
                }
            ).length;

        const resolved =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Resolved"
                    );
                }
            ).length;

        $("studentTotalComplaints").textContent =
            total;

        $("studentPendingComplaints").textContent =
            pending;

        $("studentProgressComplaints").textContent =
            progress;

        $("studentResolvedComplaints").textContent =
            resolved;

        const recent =
            complaints.slice(0, 5);

        const container =
            $("studentRecentComplaints");

        if (!recent.length) {
            container.innerHTML =
                '<div class="empty-state">You have not submitted any complaints yet.</div>';

            return;
        }

        container.innerHTML =
            recent.map(
                function (complaint) {
                    return `
                        <div class="complaint-list-item">

                            <div class="complaint-list-info">

                                <strong>
                                    ${escapeHTML(complaint.id)}
                                </strong>

                                <h3>
                                    ${escapeHTML(complaint.subject)}
                                </h3>

                                <p>
                                    ${escapeHTML(complaint.location)}
                                </p>

                                <small>
                                    Submitted:
                                    ${formatDateTime(complaint.submittedAt)}
                                </small>

                            </div>

                            <div class="complaint-list-action">

                                <span class="status-badge ${getStatusClass(complaint.status)}">
                                    ${escapeHTML(getStatusText(complaint.status))}
                                </span>

                                <button
                                    type="button"
                                    class="btn secondary-btn student-view-details"
                                    data-id="${escapeHTML(complaint.id)}">
                                    Track Complaint
                                </button>

                            </div>

                        </div>
                    `;
                }
            ).join("");

        container
            .querySelectorAll(
                ".student-view-details"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            openComplaintDetails(
                                button.dataset.id,
                                false
                            );
                        }
                    );
                }
            );
    }

    function renderStudentComplaints() {
        if (!currentStudent) {
            return;
        }

        const searchInput =
            $("studentComplaintSearch");

        const filterInput =
            $("studentStatusFilter");

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const filter =
            filterInput
                ? filterInput.value
                : "all";

        let complaints =
            getComplaints().filter(
                function (complaint) {
                    return (
                        complaint.studentId ===
                        currentStudent.id
                    );
                }
            );

        if (search) {
            complaints =
                complaints.filter(
                    function (complaint) {
                        return (
                            String(
                                complaint.id
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.subject
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.location
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.description
                            )
                                .toLowerCase()
                                .includes(search)
                        );
                    }
                );
        }

        if (filter !== "all") {
            complaints =
                complaints.filter(
                    function (complaint) {
                        return (
                            complaint.status ===
                            filter
                        );
                    }
                );
        }

        const container =
            $("studentComplaintTrackerList");

        if (!complaints.length) {
            container.innerHTML =
                '<div class="empty-state">No complaints found.</div>';

            return;
        }

        container.innerHTML =
            complaints.map(
                function (complaint) {

                    const hasUpdate =
                        complaint.lastUpdatedAt &&
                        complaint.lastUpdatedAt !==
                        complaint.submittedAt;

                    return `
                        <div class="tracker-card">

                            ${
                                hasUpdate
                                    ? `
                                    <div style="
                                        margin-bottom:12px;
                                        padding:8px 12px;
                                        border-radius:8px;
                                        background:#fff3cd;
                                        color:#856404;
                                        font-weight:700;
                                        font-size:13px;
                                    ">
                                        NEW UPDATE
                                    </div>
                                    `
                                    : ""
                            }

                            <div class="tracker-main">

                                <div>

                                    <span class="complaint-id">
                                        ${escapeHTML(complaint.id)}
                                    </span>

                                    <h3>
                                        ${escapeHTML(complaint.subject)}
                                    </h3>

                                    <p>
                                        ${escapeHTML(complaint.location)}
                                    </p>

                                    <small>
                                        Submitted:
                                        ${formatDateTime(complaint.submittedAt)}
                                    </small>

                                    ${
                                        hasUpdate
                                            ? `
                                                <br>
                                                <small>
                                                    Last Updated:
                                                    ${formatDateTime(complaint.lastUpdatedAt)}
                                                </small>
                                            `
                                            : ""
                                    }

                                </div>

                                <div class="tracker-side">

                                    <span class="status-badge ${getStatusClass(complaint.status)}">
                                        ${escapeHTML(complaint.status)}
                                    </span>

                                    <button
                                        type="button"
                                        class="btn secondary-btn student-view-details"
                                        data-id="${escapeHTML(complaint.id)}">
                                        Track Complaint
                                    </button>

                                </div>

                            </div>

                        </div>
                    `;
                }
            ).join("");

        container
            .querySelectorAll(
                ".student-view-details"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            openComplaintDetails(
                                button.dataset.id,
                                false
                            );
                        }
                    );
                }
            );
    }

    function renderAdminDashboard() {
        const complaints =
            getComplaints();

        const total =
            complaints.length;

        const pending =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Pending"
                    );
                }
            ).length;

        const acknowledged =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Acknowledged"
                    );
                }
            ).length;

        const progress =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "In Progress"
                    );
                }
            ).length;

        const resolved =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Resolved"
                    );
                }
            ).length;

        $("adminTotalComplaints").textContent =
            total;

        $("adminPendingComplaints").textContent =
            pending;

        $("adminAcknowledgedComplaints").textContent =
            acknowledged;

        $("adminProgressComplaints").textContent =
            progress;

        $("adminResolvedComplaints").textContent =
            resolved;

        const container =
            $("adminRecentComplaints");

        const recent =
            complaints.slice(0, 5);

        if (!recent.length) {
            container.innerHTML =
                '<div class="empty-state">No complaints have been submitted.</div>';

            return;
        }

        container.innerHTML =
            recent.map(
                function (complaint) {
                    return `
                        <div class="admin-recent-item">

                            <div>

                                <strong>
                                    ${escapeHTML(complaint.id)}
                                </strong>

                                <h3>
                                    ${escapeHTML(complaint.subject)}
                                </h3>

                                <p>
                                    ${escapeHTML(complaint.studentName)}
                                    ·
                                    ${escapeHTML(complaint.department)}
                                </p>

                            </div>

                            <div>

                                <span class="status-badge ${getStatusClass(complaint.status)}">
                                    ${escapeHTML(complaint.status)}
                                </span>

                                <button
                                    type="button"
                                    class="btn secondary-btn admin-view-details"
                                    data-id="${escapeHTML(complaint.id)}">
                                    Manage
                                </button>

                            </div>

                        </div>
                    `;
                }
            ).join("");

        container
            .querySelectorAll(
                ".admin-view-details"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            openComplaintDetails(
                                button.dataset.id,
                                true
                            );
                        }
                    );
                }
            );
    }

    function renderAllComplaints() {
        const tableBody =
            $("adminComplaintsTableBody");

        if (!tableBody) {
            return;
        }

        const searchElement =
            $("adminComplaintSearch");

        const filterElement =
            $("adminStatusFilter");

        const search =
            searchElement
                ? searchElement.value
                    .trim()
                    .toLowerCase()
                : "";

        const filter =
            filterElement
                ? filterElement.value
                : "all";

        let complaints =
            getComplaints();

        if (search) {
            complaints =
                complaints.filter(
                    function (complaint) {
                        return (
                            String(
                                complaint.id
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.studentName
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.studentId
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.department
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.subject
                            )
                                .toLowerCase()
                                .includes(search) ||

                            String(
                                complaint.location
                            )
                                .toLowerCase()
                                .includes(search)
                        );
                    }
                );
        }

        if (filter !== "all") {
            complaints =
                complaints.filter(
                    function (complaint) {
                        return (
                            complaint.status ===
                            filter
                        );
                    }
                );
        }

        if (!complaints.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9">
                        No complaints found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            complaints.map(
                function (complaint) {

                    const date =
                        new Date(
                            complaint.submittedAt
                        );

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(complaint.id)}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(complaint.studentName)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.studentId)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.department)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.subject)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.location)}
                            </td>

                            <td>
                                ${formatDate(date)}
                                <br>
                                <small>
                                    ${formatTime(date)}
                                </small>
                            </td>

                            <td>
                                <span class="status-badge ${getStatusClass(complaint.status)}">
                                    ${escapeHTML(complaint.status)}
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    class="btn primary-btn admin-manage-button"
                                    data-id="${escapeHTML(complaint.id)}">
                                    Manage
                                </button>
                            </td>

                        </tr>
                    `;
                }
            ).join("");

        tableBody
            .querySelectorAll(
                ".admin-manage-button"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            openComplaintDetails(
                                button.dataset.id,
                                true
                            );
                        }
                    );
                }
            );
    }

    function renderMaintenance() {
        const tableBody =
            $("adminMaintenanceTableBody");

        if (!tableBody) {
            return;
        }

        const complaints =
            getComplaints().filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Acknowledged" ||

                        complaint.status ===
                        "In Progress" ||

                        complaint.status ===
                        "Resolved"
                    );
                }
            );

        const active =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Acknowledged" ||

                        complaint.status ===
                        "In Progress"
                    );
                }
            ).length;

        const resolved =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Resolved"
                    );
                }
            ).length;

        $("activeMaintenanceCount").textContent =
            active;

        $("resolvedMaintenanceCount").textContent =
            resolved;

        if (!complaints.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No maintenance requests yet.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            complaints.map(
                function (complaint) {

                    let resolvedDate =
                        "-";

                    if (complaint.resolvedAt) {
                        resolvedDate =
                            formatDate(
                                new Date(
                                    complaint.resolvedAt
                                )
                            );
                    }

                    return `
                        <tr>

                            <td>
                                ${escapeHTML(complaint.id)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.subject)}
                            </td>

                            <td>
                                ${escapeHTML(complaint.location)}
                            </td>

                            <td>
                                ${escapeHTML(
                                    complaint.maintenanceStaff ||
                                    "Not Assigned"
                                )}
                            </td>

                            <td>
                                <span class="status-badge ${getStatusClass(complaint.status)}">
                                    ${escapeHTML(complaint.status)}
                                </span>
                            </td>

                            <td>
                                ${escapeHTML(resolvedDate)}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="btn primary-btn maintenance-manage-button"
                                    data-id="${escapeHTML(complaint.id)}">
                                    Manage
                                </button>

                            </td>

                        </tr>
                    `;
                }
            ).join("");

        tableBody
            .querySelectorAll(
                ".maintenance-manage-button"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            openComplaintDetails(
                                button.dataset.id,
                                true
                            );
                        }
                    );
                }
            );
    }

    function renderStaff() {
        const container =
            $("staffList");

        if (!container) {
            return;
        }

        const staff =
            getStaff();

        container.innerHTML =
            staff.map(
                function (person) {
                    return `
                        <div class="staff-card">

                            <div class="staff-avatar">
                                ${escapeHTML(
                                    person.name
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </div>

                            <div class="staff-info">

                                <h3>
                                    ${escapeHTML(person.name)}
                                </h3>

                                <p>
                                    ${escapeHTML(person.position)}
                                </p>

                                <small>
                                    ${escapeHTML(person.id)}
                                </small>

                            </div>

                        </div>
                    `;
                }
            ).join("");
    }

    function renderReports() {
        const complaints =
            getComplaints();

        const total =
            complaints.length;

        const resolved =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Resolved"
                    );
                }
            ).length;

        const pending =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Pending"
                    );
                }
            ).length;

        const active =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Acknowledged" ||

                        complaint.status ===
                        "In Progress"
                    );
                }
            ).length;

        const rate =
            total > 0
                ? Math.round(
                    (resolved / total) * 100
                )
                : 0;

        $("reportTotal").textContent =
            total;

        $("reportResolutionRate").textContent =
            rate + "%";

        $("reportPending").textContent =
            pending;

        $("reportActive").textContent =
            active;
    }

    /*
     * =========================================================
     * ORGANIZED COMPLAINT DETAILS
     * =========================================================
     */

    function createOrganizedDetails(complaint) {
        const submittedDate =
            new Date(
                complaint.submittedAt
            );

        const updatedDate =
            complaint.lastUpdatedAt
                ? new Date(
                    complaint.lastUpdatedAt
                )
                : submittedDate;

        const hasUpdate =
            complaint.lastUpdatedAt &&
            complaint.lastUpdatedAt !==
            complaint.submittedAt;

        const updateTitle =
            complaint.status === "Pending"
                ? "Complaint Received"
                : complaint.status === "Acknowledged"
                    ? "Complaint Acknowledged"
                    : complaint.status === "In Progress"
                        ? "Maintenance Update"
                        : "Complaint Resolved";

        const updateMessage =
            getStatusDescription(
                complaint.status
            );

        return `
            <div
                id="organizedComplaintDetails"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:16px;
                    margin-bottom:18px;
                "
            >

                <!-- COMPLAINT ID HEADER -->

                <div
                    style="
                        padding:16px;
                        border-radius:14px;
                        background:#f4f8fa;
                        border:1px solid #dce7eb;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:12px;
                            flex-wrap:wrap;
                        "
                    >

                        <div>
                            <small
                                style="
                                    display:block;
                                    margin-bottom:4px;
                                    opacity:.7;
                                "
                            >
                                COMPLAINT ID
                            </small>

                            <strong
                                style="
                                    font-size:18px;
                                "
                            >
                                ${escapeHTML(complaint.id)}
                            </strong>
                        </div>

                        <span
                            class="status-badge ${getStatusClass(complaint.status)}"
                        >
                            ${escapeHTML(complaint.status)}
                        </span>

                    </div>

                </div>


                <!-- SUBMITTED INFORMATION -->

                <div
                    style="
                        border:1px solid #dce7eb;
                        border-radius:14px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            padding:13px 16px;
                            background:#f4f8fa;
                            font-weight:700;
                        "
                    >
                        Submitted Information
                    </div>

                    <div
                        style="
                            padding:16px;
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(190px, 1fr)
                                );
                            gap:14px;
                        "
                    >

                        <div>
                            <small>Student Name</small>
                            <strong style="display:block;">
                                ${escapeHTML(
                                    complaint.studentName
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Student ID</small>
                            <strong style="display:block;">
                                ${escapeHTML(
                                    complaint.studentId
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Department</small>
                            <strong style="display:block;">
                                ${escapeHTML(
                                    complaint.department
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Date Submitted</small>
                            <strong style="display:block;">
                                ${formatDate(
                                    submittedDate
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Time Submitted</small>
                            <strong style="display:block;">
                                ${formatTime(
                                    submittedDate
                                )}
                            </strong>
                        </div>

                    </div>

                </div>


                <!-- COMPLAINT DETAILS -->

                <div
                    style="
                        border:1px solid #dce7eb;
                        border-radius:14px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            padding:13px 16px;
                            background:#f4f8fa;
                            font-weight:700;
                        "
                    >
                        Complaint Details
                    </div>

                    <div
                        style="
                            padding:16px;
                            display:flex;
                            flex-direction:column;
                            gap:14px;
                        "
                    >

                        <div>
                            <small>Subject</small>

                            <strong
                                style="
                                    display:block;
                                    font-size:17px;
                                "
                            >
                                ${escapeHTML(
                                    complaint.subject
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Location</small>

                            <strong
                                style="
                                    display:block;
                                "
                            >
                                ${escapeHTML(
                                    complaint.location
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Complaint / Concern</small>

                            <div
                                style="
                                    margin-top:6px;
                                    padding:12px;
                                    border-radius:10px;
                                    background:#f8fafb;
                                    line-height:1.6;
                                "
                            >
                                ${escapeHTML(
                                    complaint.description
                                )}
                            </div>
                        </div>

                    </div>

                </div>


                <!-- LATEST UPDATE -->

                <div
                    style="
                        border:2px solid #f0c36a;
                        border-radius:14px;
                        overflow:hidden;
                        background:#fffaf0;
                    "
                >

                    <div
                        style="
                            padding:13px 16px;
                            background:#fff1c9;
                            font-weight:700;
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <span>
                            Latest Update
                        </span>

                        ${
                            hasUpdate
                                ? `
                                    <span
                                        style="
                                            font-size:11px;
                                            padding:4px 8px;
                                            border-radius:20px;
                                            background:#e6a900;
                                            color:white;
                                        "
                                    >
                                        NEW UPDATE
                                    </span>
                                `
                                : ""
                        }

                    </div>

                    <div
                        style="
                            padding:16px;
                        "
                    >

                        <strong
                            style="
                                display:block;
                                margin-bottom:6px;
                            "
                        >
                            ${escapeHTML(updateTitle)}
                        </strong>

                        <p
                            style="
                                margin:0 0 10px;
                                line-height:1.5;
                            "
                        >
                            ${escapeHTML(updateMessage)}
                        </p>

                        <small>
                            Last Updated:
                            ${formatDateTime(
                                complaint.lastUpdatedAt
                            )}
                        </small>

                    </div>

                </div>


                <!-- COMPLAINT PROGRESS -->

                <div
                    style="
                        border:1px solid #dce7eb;
                        border-radius:14px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            padding:13px 16px;
                            background:#f4f8fa;
                            font-weight:700;
                        "
                    >
                        Complaint Progress
                    </div>

                    <div
                        style="
                            padding:18px 16px;
                        "
                    >

                        <div
                            style="
                                display:flex;
                                flex-direction:column;
                                gap:14px;
                            "
                        >

                            ${createProgressStep(
                                "1",
                                "Submitted",
                                "Complaint received",
                                complaint.status,
                                "Pending"
                            )}

                            ${createProgressStep(
                                "2",
                                "Acknowledged",
                                "Reviewed by office",
                                complaint.status,
                                "Acknowledged"
                            )}

                            ${createProgressStep(
                                "3",
                                "In Progress",
                                "Maintenance is handling the issue",
                                complaint.status,
                                "In Progress"
                            )}

                            ${createProgressStep(
                                "4",
                                "Resolved",
                                "Issue has been resolved",
                                complaint.status,
                                "Resolved"
                            )}

                        </div>

                    </div>

                </div>


                <!-- MAINTENANCE / RESOLUTION -->

                <div
                    style="
                        border:1px solid #dce7eb;
                        border-radius:14px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            padding:13px 16px;
                            background:#f4f8fa;
                            font-weight:700;
                        "
                    >
                        Maintenance & Resolution
                    </div>

                    <div
                        style="
                            padding:16px;
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(190px, 1fr)
                                );
                            gap:14px;
                        "
                    >

                        <div>
                            <small>Maintenance Staff</small>

                            <strong
                                style="display:block;"
                            >
                                ${escapeHTML(
                                    complaint.maintenanceStaff ||
                                    "Not Assigned"
                                )}
                            </strong>
                        </div>

                        <div>
                            <small>Date Resolved</small>

                            <strong
                                style="display:block;"
                            >
                                ${
                                    complaint.resolvedAt
                                        ? formatDate(
                                            new Date(
                                                complaint.resolvedAt
                                            )
                                        )
                                        : "-"
                                }
                            </strong>
                        </div>

                        <div>
                            <small>Time Resolved</small>

                            <strong
                                style="display:block;"
                            >
                                ${
                                    complaint.resolvedAt
                                        ? formatTime(
                                            new Date(
                                                complaint.resolvedAt
                                            )
                                        )
                                        : "-"
                                }
                            </strong>
                        </div>

                    </div>

                    <div
                        style="
                            padding:0 16px 16px;
                        "
                    >

                        <small>
                            Resolution Notes
                        </small>

                        <div
                            style="
                                margin-top:6px;
                                padding:12px;
                                border-radius:10px;
                                background:#f8fafb;
                                line-height:1.6;
                            "
                        >
                            ${escapeHTML(
                                complaint.resolutionNotes ||
                                "No resolution notes yet."
                            )}
                        </div>

                    </div>

                </div>

            </div>
        `;
    }

    function createProgressStep(
        number,
        title,
        description,
        currentStatus,
        stepStatus
    ) {
        const order = {
            Pending: 1,
            Acknowledged: 2,
            "In Progress": 3,
            Resolved: 4
        };

        const currentOrder =
            order[currentStatus] || 1;

        const stepOrder =
            order[stepStatus];

        let state = "";

        if (currentOrder > stepOrder) {
            state = "completed";
        } else if (currentOrder === stepOrder) {
            state = "current";
        }

        return `
            <div
                style="
                    display:flex;
                    align-items:flex-start;
                    gap:12px;
                "
            >

                <div
                    style="
                        min-width:34px;
                        width:34px;
                        height:34px;
                        border-radius:50%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-weight:700;
                        background:
                            ${
                                state === "completed" ||
                                state === "current"
                                    ? "#0d8b8b"
                                    : "#e8eef0"
                            };
                        color:
                            ${
                                state === "completed" ||
                                state === "current"
                                    ? "white"
                                    : "#6b7a80"
                            };
                    "
                >
                    ${
                        state === "completed"
                            ? "✓"
                            : number
                    }
                </div>

                <div>

                    <strong
                        style="
                            display:block;
                        "
                    >
                        ${title}
                    </strong>

                    <small>
                        ${description}
                    </small>

                </div>

            </div>
        `;
    }

    function openComplaintDetails(
        id,
        isAdmin
    ) {
        const complaints =
            getComplaints();

        const complaint =
            complaints.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!complaint) {
            alert(
                "Complaint not found."
            );

            return;
        }

        currentComplaintId =
            complaint.id;

        /*
         * Keep all original detail fields updated.
         * This means the existing HTML still works.
         */

        if ($("detailsComplaintSubject")) {
            $("detailsComplaintSubject").textContent =
                complaint.subject;
        }

        if ($("detailsComplaintId")) {
            $("detailsComplaintId").textContent =
                complaint.id;
        }

        if ($("detailsStudentName")) {
            $("detailsStudentName").textContent =
                complaint.studentName;
        }

        if ($("detailsStudentId")) {
            $("detailsStudentId").textContent =
                complaint.studentId;
        }

        if ($("detailsDepartment")) {
            $("detailsDepartment").textContent =
                complaint.department;
        }

        if ($("detailsLocation")) {
            $("detailsLocation").textContent =
                complaint.location;
        }

        const submittedDate =
            new Date(
                complaint.submittedAt
            );

        if ($("detailsSubmissionDate")) {
            $("detailsSubmissionDate").textContent =
                formatDate(
                    submittedDate
                );
        }

        if ($("detailsSubmissionTime")) {
            $("detailsSubmissionTime").textContent =
                formatTime(
                    submittedDate
                );
        }

        if ($("detailsDescription")) {
            $("detailsDescription").textContent =
                complaint.description;
        }

        if ($("detailsCurrentStatus")) {
            $("detailsCurrentStatus").textContent =
                complaint.status;

            $("detailsCurrentStatus").className =
                "status-badge " +
                getStatusClass(
                    complaint.status
                );
        }

        if ($("detailsMaintenanceStaff")) {
            $("detailsMaintenanceStaff").textContent =
                complaint.maintenanceStaff ||
                "Not Assigned";
        }

        if (complaint.resolvedAt) {
            const resolvedDate =
                new Date(
                    complaint.resolvedAt
                );

            if ($("detailsResolvedDate")) {
                $("detailsResolvedDate").textContent =
                    formatDate(
                        resolvedDate
                    );
            }

            if ($("detailsResolvedTime")) {
                $("detailsResolvedTime").textContent =
                    formatTime(
                        resolvedDate
                    );
            }
        } else {
            if ($("detailsResolvedDate")) {
                $("detailsResolvedDate").textContent =
                    "-";
            }

            if ($("detailsResolvedTime")) {
                $("detailsResolvedTime").textContent =
                    "-";
            }
        }

        if ($("detailsResolutionNotes")) {
            $("detailsResolutionNotes").textContent =
                complaint.resolutionNotes ||
                "No resolution notes yet.";
        }

        updateTimeline(
            complaint.status
        );

        /*
         * =====================================================
         * INSERT ORGANIZED VIEW
         * =====================================================
         */

        const modal =
            $("complaintDetailsModal");

        if (modal) {
            let organized =
                $("organizedComplaintDetails");

            if (organized) {
                organized.remove();
            }

            organized =
                document.createElement("div");

            organized.id =
                "organizedComplaintDetails";

            organized.innerHTML =
                createOrganizedDetails(
                    complaint
                );

            /*
             * Put the organized information before
             * the admin update section.
             */

            const updateSection =
                $("adminUpdateSection");

            if (updateSection) {
                updateSection.parentNode.insertBefore(
                    organized,
                    updateSection
                );
            } else {
                const modalContent =
                    modal.querySelector(
                        ".modal-content"
                    ) ||
                    modal.querySelector(
                        ".modal-body"
                    );

                if (modalContent) {
                    modalContent.appendChild(
                        organized
                    );
                }
            }
        }

        const updateSection =
            $("adminUpdateSection");

        if (updateSection) {
            if (isAdmin) {
                updateSection.classList.remove(
                    "hidden"
                );

                $("updateComplaintStatus").value =
                    complaint.status;

                $("updateMaintenanceStaff").value =
                    complaint.maintenanceStaff ||
                    "";

                $("resolutionNotes").value =
                    complaint.resolutionNotes ||
                    "";
            } else {
                updateSection.classList.add(
                    "hidden"
                );
            }
        }

        openModal(
            "complaintDetailsModal"
        );
    }

    function updateTimeline(status) {
        const steps = [
            $("timelinePending"),
            $("timelineAcknowledged"),
            $("timelineProgress"),
            $("timelineResolved")
        ];

        steps.forEach(
            function (step) {
                if (!step) {
                    return;
                }

                step.classList.remove(
                    "completed"
                );

                step.classList.remove(
                    "current"
                );
            }
        );

        let completedCount = 1;

        if (status === "Acknowledged") {
            completedCount = 2;
        }

        if (status === "In Progress") {
            completedCount = 3;
        }

        if (status === "Resolved") {
            completedCount = 4;
        }

        for (
            let i = 0;
            i < completedCount;
            i++
        ) {
            if (steps[i]) {
                steps[i].classList.add(
                    "completed"
                );
            }
        }

        if (
            status !== "Resolved" &&
            steps[completedCount - 1]
        ) {
            steps[
                completedCount - 1
            ].classList.add(
                "current"
            );
        }
    }

    function saveComplaintUpdate() {
        if (!currentComplaintId) {
            return;
        }

        const complaints =
            getComplaints();

        const index =
            complaints.findIndex(
                function (complaint) {
                    return (
                        complaint.id ===
                        currentComplaintId
                    );
                }
            );

        if (index === -1) {
            alert(
                "Complaint not found."
            );

            return;
        }

        const status =
            $("updateComplaintStatus").value;

        const staff =
            $("updateMaintenanceStaff")
                .value
                .trim();

        const notes =
            $("resolutionNotes")
                .value
                .trim();

        const now =
            new Date();

        const nowISO =
            now.toISOString();

        const oldStatus =
            complaints[index].status;

        const oldStaff =
            complaints[index]
                .maintenanceStaff || "";

        const oldNotes =
            complaints[index]
                .resolutionNotes || "";

        complaints[index].status =
            status;

        complaints[index].maintenanceStaff =
            staff;

        complaints[index].resolutionNotes =
            notes;

        complaints[index].lastUpdatedAt =
            nowISO;

        complaints[index].lastUpdatedBy =
            "SchoolCare Office";

        if (
            !Array.isArray(
                complaints[index].updateHistory
            )
        ) {
            complaints[index].updateHistory =
                [];
        }

        /*
         * Save an update history item only when
         * something actually changed.
         */

        if (
            oldStatus !== status ||
            oldStaff !== staff ||
            oldNotes !== notes
        ) {
            complaints[index]
                .updateHistory
                .push({
                    status:
                        status,

                    date:
                        nowISO,

                    staff:
                        staff,

                    notes:
                        notes
                });
        }

        if (status === "Resolved") {
            if (
                !complaints[index]
                    .resolvedAt
            ) {
                complaints[index]
                    .resolvedAt =
                    nowISO;
            }
        } else {
            complaints[index]
                .resolvedAt =
                null;
        }

        saveComplaints(
            complaints
        );

        closeModal(
            "complaintDetailsModal"
        );

        renderAdminDashboard();
        renderAllComplaints();
        renderMaintenance();
        renderReports();

        if (currentStudent) {
            renderStudentDashboard();
            renderStudentComplaints();
            updateStudentNotifications();
        }

        updateOfficeNotifications();

        alert(
            "Complaint updated successfully."
        );
    }

    /*
     * =========================================================
     * STUDENT NOTIFICATIONS
     * =========================================================
     */

    function updateStudentNotifications() {
        if (!currentStudent) {
            return;
        }

        const complaints =
            getComplaints().filter(
                function (complaint) {
                    return (
                        complaint.studentId ===
                        currentStudent.id
                    );
                }
            );

        /*
         * Count complaints that have an office update.
         */

        const updates =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.lastUpdatedAt &&
                        complaint.lastUpdatedAt !==
                        complaint.submittedAt
                    );
                }
            );

        const count =
            updates.length;

        $("studentNotificationCount")
            .textContent = count;

        const list =
            $("notificationList");

        if (!list) {
            return;
        }

        if (!complaints.length) {
            list.innerHTML =
                '<div class="empty-state">No notifications.</div>';

            return;
        }

        const sorted =
            complaints.slice().sort(
                function (a, b) {
                    return (
                        new Date(
                            b.lastUpdatedAt ||
                            b.submittedAt
                        ) -
                        new Date(
                            a.lastUpdatedAt ||
                            a.submittedAt
                        )
                    );
                }
            );

        const newUpdates =
            sorted.filter(
                function (complaint) {
                    return (
                        complaint.lastUpdatedAt &&
                        complaint.lastUpdatedAt !==
                        complaint.submittedAt
                    );
                }
            );

        const previous =
            sorted.filter(
                function (complaint) {
                    return !(
                        complaint.lastUpdatedAt &&
                        complaint.lastUpdatedAt !==
                        complaint.submittedAt
                    );
                }
            );

        let html = "";

        if (newUpdates.length) {
            html += `
                <div
                    style="
                        padding:10px 12px;
                        font-weight:700;
                        font-size:13px;
                        color:#0d7070;
                    "
                >
                    NEW UPDATES
                </div>
            `;

            html +=
                newUpdates
                    .slice(0, 10)
                    .map(
                        function (complaint) {
                            return `
                                <button
                                    type="button"
                                    class="notification-item notification-clickable"
                                    data-id="${escapeHTML(complaint.id)}"
                                    style="
                                        width:100%;
                                        text-align:left;
                                        border:0;
                                        cursor:pointer;
                                        background:#fff8df;
                                    "
                                >

                                    <strong>
                                        NEW •
                                        ${escapeHTML(
                                            complaint.subject
                                        )}
                                    </strong>

                                    <span>
                                        Status:
                                        ${escapeHTML(
                                            complaint.status
                                        )}
                                    </span>

                                    <small>
                                        Updated:
                                        ${formatDateTime(
                                            complaint.lastUpdatedAt
                                        )}
                                    </small>

                                </button>
                            `;
                        }
                    )
                    .join("");
        }

        if (previous.length) {
            html += `
                <div
                    style="
                        padding:10px 12px;
                        margin-top:5px;
                        font-weight:700;
                        font-size:13px;
                        color:#68777d;
                    "
                >
                    MY COMPLAINTS
                </div>
            `;

            html +=
                previous
                    .slice(0, 10)
                    .map(
                        function (complaint) {
                            return `
                                <button
                                    type="button"
                                    class="notification-item notification-clickable"
                                    data-id="${escapeHTML(complaint.id)}"
                                    style="
                                        width:100%;
                                        text-align:left;
                                        border:0;
                                        cursor:pointer;
                                    "
                                >

                                    <strong>
                                        ${escapeHTML(
                                            complaint.subject
                                        )}
                                    </strong>

                                    <span>
                                        Status:
                                        ${escapeHTML(
                                            complaint.status
                                        )}
                                    </span>

                                </button>
                            `;
                        }
                    )
                    .join("");
        }

        list.innerHTML =
            html ||
            '<div class="empty-state">No notifications.</div>';

        attachNotificationClicks(
            list,
            false
        );
    }

    /*
     * =========================================================
     * OFFICE NOTIFICATIONS
     * =========================================================
     */

    function updateOfficeNotifications() {
        const complaints =
            getComplaints();

        const pending =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Pending"
                    );
                }
            ).length;

        $("officeNotificationCount")
            .textContent = pending;

        const list =
            $("notificationList");

        if (!list) {
            return;
        }

        if (!complaints.length) {
            list.innerHTML =
                '<div class="empty-state">No notifications.</div>';

            return;
        }

        const newComplaints =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status ===
                        "Pending"
                    );
                }
            );

        const updatedComplaints =
            complaints.filter(
                function (complaint) {
                    return (
                        complaint.status !==
                        "Pending" &&
                        complaint.lastUpdatedAt
                    );
                }
            );

        let html = "";

        if (newComplaints.length) {
            html += `
                <div
                    style="
                        padding:10px 12px;
                        font-weight:700;
                        font-size:13px;
                        color:#0d7070;
                    "
                >
                    NEW COMPLAINTS
                </div>
            `;

            html +=
                newComplaints
                    .slice(0, 10)
                    .map(
                        function (complaint) {
                            return `
                                <button
                                    type="button"
                                    class="notification-item notification-clickable"
                                    data-id="${escapeHTML(complaint.id)}"
                                    style="
                                        width:100%;
                                        text-align:left;
                                        border:0;
                                        cursor:pointer;
                                        background:#fff8df;
                                    "
                                >

                                    <strong>
                                        NEW •
                                        ${escapeHTML(
                                            complaint.subject
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            complaint.studentName
                                        )}
                                    </span>

                                    <small>
                                        Submitted:
                                        ${formatDateTime(
                                            complaint.submittedAt
                                        )}
                                    </small>

                                </button>
                            `;
                        }
                    )
                    .join("");
        }

        if (updatedComplaints.length) {
            html += `
                <div
                    style="
                        padding:10px 12px;
                        margin-top:5px;
                        font-weight:700;
                        font-size:13px;
                        color:#68777d;
                    "
                >
                    RECENTLY UPDATED
                </div>
            `;

            html +=
                updatedComplaints
                    .slice(0, 10)
                    .map(
                        function (complaint) {
                            return `
                                <button
                                    type="button"
                                    class="notification-item notification-clickable"
                                    data-id="${escapeHTML(complaint.id)}"
                                    style="
                                        width:100%;
                                        text-align:left;
                                        border:0;
                                        cursor:pointer;
                                    "
                                >

                                    <strong>
                                        ${escapeHTML(
                                            complaint.subject
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            complaint.studentName
                                        )}
                                        ·
                                        ${escapeHTML(
                                            complaint.status
                                        )}
                                    </span>

                                    <small>
                                        Updated:
                                        ${formatDateTime(
                                            complaint.lastUpdatedAt
                                        )}
                                    </small>

                                </button>
                            `;
                        }
                    )
                    .join("");
        }

        list.innerHTML =
            html ||
            '<div class="empty-state">No notifications.</div>';

        attachNotificationClicks(
            list,
            true
        );
    }

    function attachNotificationClicks(
        list,
        isAdmin
    ) {
        list
            .querySelectorAll(
                ".notification-clickable"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                button.dataset.id;

                            $("notificationPanel")
                                .classList
                                .add("hidden");

                            openComplaintDetails(
                                id,
                                isAdmin
                            );
                        }
                    );
                }
            );
    }

    function openModal(id) {
        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.add(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    function closeModal(id) {
        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    function exportComplaints() {
        const complaints =
            getComplaints();

        if (!complaints.length) {
            alert(
                "There are no complaints to export."
            );

            return;
        }

        const headers = [
            "Complaint ID",
            "Student Name",
            "Student ID",
            "Department",
            "Subject",
            "Location",
            "Description",
            "Status",
            "Maintenance Staff",
            "Submitted",
            "Last Updated",
            "Resolved"
        ];

        const rows =
            complaints.map(
                function (complaint) {
                    return [
                        complaint.id,
                        complaint.studentName,
                        complaint.studentId,
                        complaint.department,
                        complaint.subject,
                        complaint.location,
                        complaint.description,
                        complaint.status,
                        complaint.maintenanceStaff ||
                            "",
                        complaint.submittedAt,
                        complaint.lastUpdatedAt ||
                            "",
                        complaint.resolvedAt ||
                            ""
                    ];
                }
            );

        const csv =
            [
                headers,
                ...rows
            ]
                .map(
                    function (row) {
                        return row
                            .map(
                                function (value) {
                                    return (
                                        '"' +
                                        String(
                                            value
                                        )
                                            .replace(
                                                /"/g,
                                                '""'
                                            ) +
                                        '"'
                                    );
                                }
                            )
                            .join(",");
                    }
                )
                .join("\n");

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            "schoolcare-complaints.csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            url
        );
    }

    function switchLoginType(type) {
        const studentButton =
            $("studentLoginButton");

        const officeButton =
            $("officeLoginButton");

        const studentForm =
            $("studentLoginForm");

        const officeForm =
            $("officeLoginForm");

        if (type === "student") {

            studentButton.classList.add(
                "active"
            );

            officeButton.classList.remove(
                "active"
            );

            studentForm.classList.remove(
                "hidden"
            );

            officeForm.classList.add(
                "hidden"
            );

        } else {

            studentButton.classList.remove(
                "active"
            );

            officeButton.classList.add(
                "active"
            );

            studentForm.classList.add(
                "hidden"
            );

            officeForm.classList.remove(
                "hidden"
            );
        }
    }

    function studentLogin(event) {
        event.preventDefault();

        const id =
            $("studentLoginId")
                .value
                .trim();

        const password =
            $("studentPassword")
                .value;

        const student =
            students.find(
                function (account) {
                    return (
                        account.id
                            .toLowerCase() ===
                        id.toLowerCase() &&

                        account.password ===
                        password
                    );
                }
            );

        if (!student) {
            alert(
                "Invalid Student ID or password."
            );

            return;
        }

        currentStudent =
            student;

        setStudentSession(
            student
        );

        showStudentPortal();
    }

    function officeLogin(event) {
        event.preventDefault();

        const id =
            $("officeUsername")
                .value
                .trim();

        const password =
            $("officePassword")
                .value;

        const office =
            officeAccounts.find(
                function (account) {
                    return (
                        account.id
                            .toLowerCase() ===
                        id.toLowerCase() &&

                        account.password ===
                        password
                    );
                }
            );

        if (!office) {
            alert(
                "Invalid Office ID or password."
            );

            return;
        }

        setOfficeSession(
            office
        );

        showOfficePortal();
    }

    function studentLogout() {
        clearSessions();

        currentStudent =
            null;

        showLogin();

        $("studentLoginForm").reset();
        $("officeLoginForm").reset();
    }

    function officeLogout() {
        clearSessions();

        currentStudent =
            null;

        showLogin();

        $("studentLoginForm").reset();
        $("officeLoginForm").reset();
    }

    function clearComplaintForm() {
        const form =
            $("studentComplaintForm");

        if (!form) {
            return;
        }

        form.reset();

        updateComplaintForm();
    }

    function addStaff(event) {
        event.preventDefault();

        const name =
            $("staffName")
                .value
                .trim();

        const position =
            $("staffPosition")
                .value
                .trim() ||
            "Maintenance Staff";

        if (!name) {
            alert(
                "Please enter the staff name."
            );

            return;
        }

        const staff =
            getStaff();

        staff.push({
            id:
                "STAFF-" +
                String(
                    staff.length + 1
                ).padStart(
                    3,
                    "0"
                ),

            name:
                name,

            position:
                position
        });

        saveStaff(
            staff
        );

        $("staffForm").reset();

        $("staffPosition").value =
            "Maintenance Staff";

        closeModal(
            "staffModal"
        );

        renderStaff();
    }

    function updateStudentDateTime() {
        if (
            $("complaintSubmissionDate") &&
            $("complaintSubmissionTime")
        ) {
            updateComplaintForm();
        }
    }

    function setupEvents() {
        $("studentLoginButton")
            .addEventListener(
                "click",
                function () {
                    switchLoginType(
                        "student"
                    );
                }
            );

        $("officeLoginButton")
            .addEventListener(
                "click",
                function () {
                    switchLoginType(
                        "office"
                    );
                }
            );

        $("studentLoginForm")
            .addEventListener(
                "submit",
                studentLogin
            );

        $("officeLoginForm")
            .addEventListener(
                "submit",
                officeLogin
            );

        $("studentLogoutButton")
            .addEventListener(
                "click",
                studentLogout
            );

        $("officeLogoutButton")
            .addEventListener(
                "click",
                officeLogout
            );

        $("studentComplaintForm")
            .addEventListener(
                "submit",
                submitComplaint
            );

        $("clearComplaintForm")
            .addEventListener(
                "click",
                clearComplaintForm
            );

        $("saveComplaintUpdate")
            .addEventListener(
                "click",
                saveComplaintUpdate
            );

        $("exportComplaintsButton")
            .addEventListener(
                "click",
                exportComplaints
            );

        $("studentNotificationButton")
            .addEventListener(
                "click",
                function () {

                    const panel =
                        $("notificationPanel");

                    panel.classList.toggle(
                        "hidden"
                    );

                    updateStudentNotifications();
                }
            );

        $("officeNotificationButton")
            .addEventListener(
                "click",
                function () {

                    const panel =
                        $("notificationPanel");

                    panel.classList.toggle(
                        "hidden"
                    );

                    updateOfficeNotifications();
                }
            );

        $("closeNotificationPanel")
            .addEventListener(
                "click",
                function () {
                    $("notificationPanel")
                        .classList
                        .add("hidden");
                }
            );

        $("complaintModalClose")
            .addEventListener(
                "click",
                function () {
                    closeModal(
                        "complaintDetailsModal"
                    );
                }
            );

        $("staffModalClose")
            .addEventListener(
                "click",
                function () {
                    closeModal(
                        "staffModal"
                    );
                }
            );

        $("cancelStaffButton")
            .addEventListener(
                "click",
                function () {
                    closeModal(
                        "staffModal"
                    );
                }
            );

        $("confirmationClose")
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        "confirmationModal"
                    );

                    showStudentPage(
                        "trackComplaintsPage"
                    );
                }
            );

        $("staffForm")
            .addEventListener(
                "submit",
                addStaff
            );

        document
            .querySelectorAll(
                "[data-student-page]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const page =
                                button.getAttribute(
                                    "data-student-page"
                                );

                            showStudentPage(
                                page
                            );
                        }
                    );
                }
            );

        document
            .querySelectorAll(
                "[data-admin-page]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const page =
                                button.getAttribute(
                                    "data-admin-page"
                                );

                            showAdminPage(
                                page
                            );
                        }
                    );
                }
            );

        $("studentComplaintSearch")
            .addEventListener(
                "input",
                renderStudentComplaints
            );

        $("studentStatusFilter")
            .addEventListener(
                "change",
                renderStudentComplaints
            );

        $("adminComplaintSearch")
            .addEventListener(
                "input",
                renderAllComplaints
            );

        $("adminStatusFilter")
            .addEventListener(
                "change",
                renderAllComplaints
            );

        document
            .querySelectorAll(
                ".modal-overlay"
            )
            .forEach(
                function (overlay) {

                    overlay.addEventListener(
                        "click",
                        function () {

                            const modal =
                                overlay.closest(
                                    ".modal"
                                );

                            if (modal) {

                                modal.classList.remove(
                                    "show"
                                );

                                modal.setAttribute(
                                    "aria-hidden",
                                    "true"
                                );
                            }
                        }
                    );
                }
            );

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }

                document
                    .querySelectorAll(
                        ".modal.show"
                    )
                    .forEach(
                        function (modal) {

                            modal.classList.remove(
                                "show"
                            );

                            modal.setAttribute(
                                "aria-hidden",
                                "true"
                            );
                        }
                    );

                $("notificationPanel")
                    .classList
                    .add("hidden");
            }
        );
    }

    function initialize() {
        setupEvents();

        const studentSession =
            getStudentSession();

        const officeSession =
            getOfficeSession();

        if (studentSession) {

            currentStudent =
                studentSession;

            showStudentPortal();

            return;
        }

        if (officeSession) {

            showOfficePortal();

            return;
        }

        showLogin();

        switchLoginType(
            "student"
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }

})();