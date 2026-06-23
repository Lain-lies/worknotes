const storageState = {
	record: null,
	currentSessionName: "",
	sessionList: [],

	setRecord: function (record) {
		this.record = record;
	},

	setCurrentSessionName: function (sessionName) {
		this.currentSessionName = sessionName;
	},

	setSessionList: function (sessionList) {
		this.sessionList = [...sessionList];
	},

	getRecord: function () {
		return this.record;
	},

	getCurrentSessionName: function () {
		return this.currentSessionName;
	},

	getSessionList: function () {
		return [...this.sessionList];
	},

	getSessionListFromLocalStorage: function () {
		const sessionList = Object.entries(localStorage)
			.map(([key]) => key)
			.filter((key) => key !== "lastSessionName");
		console.log(sessionList);

		return sessionList;
	},

	// HELPERS //
	resumeLastSession: function () {
		const lastSessionName = localStorage.getItem("lastSessionName");

		if (lastSessionName === null || lastSessionName === undefined) {
			console.log("No last session");
			return false;
		}

		const sessionList = this.getSessionListFromLocalStorage(lastSessionName);
		this.setSessionList(sessionList);
		this.loadSession(lastSessionName);
		return true;
	},

	loadSession: function (sessionName) {
		const sessionData = JSON.parse(localStorage.getItem(sessionName));

		if (!Array.isArray(sessionData)) {
			alert(
				"Error encountered: The session loaded is not Array and will cause saving errors",
			);
			return;
		}

		this.setRecord(sessionData);
		this.setCurrentSessionName(sessionName);

		console.log(`
Current Session: ${this.getCurrentSessionName()}
Current Record: ${this.getRecord()}
Session List: ${this.getSessionList()}`);
	},

	syncWithLocalStorage: function (newRecord) {
		this.setRecord([...this.getRecord(), newRecord]);

		localStorage.setItem(
			this.currentSessionName,
			JSON.stringify(this.getRecord()),
		);

		alert("Local Storage Synced!");

		return true;
	},

	updateSessionList: function () {
		const newSessionList = this.getSessionListFromLocalStorage();
		this.setSessionList(newSessionList);
	},

	saveLastSession: function () {
		console.log(`savelastsession: ${this.getCurrentSessionName()} `);
		localStorage.setItem("lastSessionName", this.getCurrentSessionName());
	},

	// INIT //

	init: function () {
		const now = Date.now();
		const dateObject = new Date(now);
		const currentDate = dateObject.toLocaleDateString();
		localStorage.setItem(currentDate, JSON.stringify([]));
		this.setSessionList([currentDate]);
		this.loadSession(currentDate);
		this.saveLastSession();
	},
};

const fieldState = {
	fieldElement: document.querySelector("#ticketForm"),
	fieldCallTypeButton: document.querySelector("#calltype"),
	fieldDocTypeButton: document.querySelector("#doctype"),
	fieldOnBehalfContainerElement: document.querySelector("#onbehalf"),
	fieldPwrNodes: document.querySelectorAll(".pwr"),
	fieldIncNodes: document.querySelectorAll(".inc"),

	fieldModified: false,
	fieldSaved: false,
	fieldData: {},
	fieldItselfCall: true,
	fieldInc: true,

	// SETTERS //

	setFieldModified: function (value) {
		this.fieldModified = value;
	},

	setFieldSaved: function (value) {
		this.fieldSaved = value;
	},

	setFieldData: function (value) {
		this.fieldData = value;
	},

	setFieldItselfCall: function (value) {
		this.fieldItselfCall = value;
	},

	setFieldInc: function (value) {
		this.fieldInc = value;
	},

	// GETTERS //

	getFieldModified: function () {
		return this.fieldModified;
	},

	getFieldSaved: function () {
		return this.fieldSaved;
	},

	getFieldData: function () {
		return this.fieldData;
	},

	getFieldItselfCall: function () {
		return this.fieldItselfCall;
	},

	getFieldInc: function () {
		return this.fieldInc;
	},

	// HELPERS //

	onSaveHelper: function (data) {
		if (this.getFieldModified() === false) {
			alert("No changes detected! Please modify the form before saving.");
			return;
		}

		if (this.getFieldSaved() === false) {
			this.setFieldSaved(true);
		}

		this.setFieldData(data);

		copyToClipboard(
			noteTransform(data, this.getFieldInc(), this.getFieldItselfCall()),
		);

		alert("Record Saved!");
	},

	onResetHelper: function () {
		this.fieldElement.reset();
		this.setFieldModified(false);
		this.setFieldSaved(false);
		this.setFieldData({});
		this.resetSwitchClick();
		this.setFieldItselfCall(true);
		window.location.href = "#ticketForm";
	},

	onNewNoteHelper: function () {
		if (this.getFieldSaved() === false && this.getFieldModified() === false) {
			alert("No changes detected! Please modify the form before saving.");
			return;
		}

		if (this.getFieldSaved() === false && this.getFieldModified() === true) {
			alert("Please save current record Or cancel it first.");
			return;
		}

		storageState.syncWithLocalStorage(this.getFieldData());
		this.onResetHelper();
		controlPanelDisplayState.renderAllControlPanelList();
	},

	isAllowedtoSwitchSession: function () {
		return this.getFieldSaved() === false && this.getFieldModified() === false
			? true
			: false;
	},

	fieldCleaner: function (data) {
		let _data = null;
		let temp = null;
		if (this.getFieldInc() === true) {
			const {
				newHire,
				mfaRegistered,
				ssprOffered,
				ssprOutcome,
				ticketFulfilled,
				userAgreedFulfill,
				...cleanData
			} = data;
			temp = cleanData;
		} else {
			const {
				possibleMajorIncident,
				contactType,
				machineName,
				nexthinkChecklist,
				issueResolved,
				userAgreedResolved,
				...cleanData
			} = data;
			temp = cleanData;
		}

		if (this.getFieldItselfCall() === true) {
			const {
				OBemployeeId,
				OBemployeeLocation,
				OBfullName,
				OBemail,
				OBcontactNumber,
				OBavailability,
				...cleanData
			} = temp;

			_data = cleanData;

			return _data;
		}

		return temp;
	},

	// SWITCH CLICK //

	initSwitchClick: function () {
		const defaultOptionOne = ["N/A", "Yes", "No"];
		const defaultOptionTwo = ["No", "Yes", "N/A"];
		const defaultOptionThree = ["No", "Yes"];
		const workSetupOptions = ["WFH", "Office", "Field"];
		const OBworkSetupOptions = ["N/A", "WFH", "Office", "Field"];

		// INC DOCTYPE

		this.setupSwitchClick(
			document.querySelector("[name=possibleMajorIncident]"),
			defaultOptionThree,
		);

		this.setupSwitchClick(document.querySelector("[name=contactType]"), [
			"Phone",
			"Chat",
			"Web",
		]);

		// PWR DOCTYPE

		this.setupSwitchClick(
			document.querySelector("[name=newHire]"),
			defaultOptionTwo,
		);

		this.setupSwitchClick(
			document.querySelector("[name=mfaRegistered]"),
			defaultOptionOne,
		);

		this.setupSwitchClick(
			document.querySelector("[name=ssprOffered]"),
			defaultOptionOne,
		);

		this.setupSwitchClick(document.querySelector("[name=nextActions]"), [
			"N/A",
			"Waiting for Line-Manager Approval",
			"Route the ticket to the next resolver team",
			"Set ticket to pending",
			"Set ticket to resolved",
			"Set ticket to fulfilled",
			"Cancel ticket",
		]);

		// INC DOCTYPE
		this.setupSwitchClick(
			document.querySelector("[name=issueResolved]"),
			defaultOptionOne,
		);

		this.setupSwitchClick(
			document.querySelector("[name=userAgreedResolved]"),
			defaultOptionOne,
		);

		// PWR DOCTYPE
		this.setupSwitchClick(
			document.querySelector("[name=ticketFulfilled]"),
			defaultOptionOne,
		);

		this.setupSwitchClick(
			document.querySelector("[name=userAgreedFulfill]"),
			defaultOptionOne,
		);
	},

	setupSwitchClick: function (element, options) {
		let currentOptionIndex = 0;

		element.value = options[currentOptionIndex];
		element.style.display = "none";

		const parent = element.parentElement;

		const button = document.createElement("button");

		button.textContent = options[currentOptionIndex];
		button.type = "button";
		button.classList.add("switch-click");

		button.addEventListener("click", () => {
			currentOptionIndex++;
			if (currentOptionIndex === options.length) {
				currentOptionIndex = 0;
			}
			element.value = options[currentOptionIndex];
			button.textContent = options[currentOptionIndex];
		});

		parent.appendChild(button);
	},

	resetSwitchClick: function () {
		const switchClickButtons = document.querySelectorAll(".switch-click");

		switchClickButtons.forEach((button) => {
			button.remove();
		});

		this.initSwitchClick();
	},

	// MINIMUM DATA SET AUTOFILL //

	initFieldConditions: function () {
		this.fieldOnBehalfContainerElement.style.display = "none";

		this.fieldCallTypeButton.addEventListener("click", (e) => {
			e.preventDefault();
			if (this.getFieldItselfCall() === true) {
				this.setFieldItselfCall(false);
				this.fieldOnBehalfContainerElement.style.display = "block";
				e.target.textContent = "OnBehalf";
			} else {
				this.setFieldItselfCall(true);
				this.fieldOnBehalfContainerElement.style.display = "none";
				e.target.textContent = "Itself";
			}
		});

		this.fieldPwrNodes.forEach((element) => (element.style.display = "none"));

		this.fieldDocTypeButton.addEventListener("click", (e) => {
			e.preventDefault();

			if (this.getFieldInc() === true) {
				this.setFieldInc(false);
				this.fieldIncNodes.forEach(
					(element) => (element.style.display = "none"),
				);
				this.fieldPwrNodes.forEach(
					(element) => (element.style.display = "block"),
				);
				e.target.textContent = "Password Reset";
			} else {
				this.setFieldInc(true);
				this.fieldIncNodes.forEach(
					(element) => (element.style.display = "block"),
				);
				this.fieldPwrNodes.forEach(
					(element) => (element.style.display = "none"),
				);
				e.target.textContent = "Incident";
			}
		});
	},

	initAutoFillMinimumDataSet: function () {
		const element = document.querySelector("[name=resolutionNotes]");
		const parent = element.parentElement;

		const buttonOne = document.createElement("button");
		buttonOne.textContent = "PW Reset VERIFIED";
		const buttonTwo = document.createElement("button");
		buttonTwo.textContent = "PW Reset NOT VERIFIED";

		const buttonThree = document.createElement("button");
		buttonThree.textContent = "Incident Routed";
		const buttonFour = document.createElement("button");
		buttonFour.textContent = "Incident Resolved";

		buttonOne.type = "button";
		buttonTwo.type = "button";
		buttonThree.type = "button";
		buttonFour.type = "button";

		buttonOne.addEventListener("click", () => {
			const resetType = element.value;
			element.value = `
- Checked Users account via ${resetType}
- User account is active
- Verified the user via verification tool
- User is verified
- Successfully reset user's password 
- Provided the password to the user
- User tried the password on his/her end
- User successfully signed in
- Provided ticket number to user
- User acknowledged
- End call 


		`;
		});
		buttonTwo.addEventListener("click", () => {
			const resetType = element.value;
			element.value = `
- Checked Users account via  ${resetType}
- Verified the user via verification tool
- User is not verified
- Filed a password reset request for user 
- Advised user that the request is subject to line-manager's approval
- Provided Ticket Number
- User Acknowledged
- End call

		`;
		});

		buttonThree.addEventListener("click", () => {
			element.value += `
- Advised user ticket will be routed to [NAME] team
- Provided ticket number to the user
- User Acknowledged
- End call`;
		});

		buttonFour.addEventListener("click", () => {
			element.value += `
- Issue Resolved
- Provided ticket number to the user
- Confirmed with user ticket can now be set to resolved
- End call`;
		});
		parent.appendChild(buttonOne);
		parent.appendChild(buttonTwo);
		parent.appendChild(buttonThree);
		parent.appendChild(buttonFour);
	},

	initTextAreaAutoFormat: function () {
		const resolutionNotesElement = document.querySelector(
			"[name=resolutionNotes]",
		);

		resolutionNotesElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.target.value += `
- `;
			}
		});

		const issueDescriptionElement = document.querySelector(
			"[name=issueDescription]",
		);

		issueDescriptionElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.target.value += `
- `;
			}
		});
	},

	initKBShortcut: function () {
		const kbaElement = document.querySelector("[name=kbArticle]");

		const shortcuts = {
			ad: "KB0034635",
			css: "KB0036245",
			ds: "KB0036249",
			ldap: "KB0034367",
			cwq: "KB0034367",
			arcos: "KB0011194",
			max: "KB0050099",
			power: "KB0010724",
			sap: "KB0028648",
			win11: "KB0042494",
			laptop: "KB0041117",
			mobile: "KB0041555",
			avd: "KB0042642",
			o365: "KB0034763",
			outlook: "KB0035272",
			intune: "KB0035752",
			mfa: "KB0040875",
			myhub: "KB0040883",
			teams: "KB0041367",
			adsup: "KB0035746",
		};

		kbaElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				const value = shortcuts[e.target.value];
				if (value === null || value === undefined) return;
				e.target.value = value;
			}
		});
	},

	// INIT //

	init: function () {
		this.fieldElement.addEventListener("input", () => {
			this.setFieldModified(true);
		});

		this.fieldElement.addEventListener("submit", (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			const data = Object.fromEntries(formData.entries());
			const cleanedData = this.fieldCleaner(data);
			this.onSaveHelper(cleanedData);
		});

		const resetButton = document.querySelector("#cancelButton");
		resetButton.addEventListener("click", () => {
			if (
				confirm(
					"Are you sure you want to cancel? All unsaved changes will be lost.",
				)
			) {
				this.onResetHelper();
			}
		});

		const newNoteButton = document.querySelector("#newNoteButton");
		newNoteButton.addEventListener("click", () => {
			this.onNewNoteHelper();
		});

		this.initFieldConditions();
		this.initSwitchClick();
		this.initAutoFillMinimumDataSet();
		this.initTextAreaAutoFormat();
		this.initKBShortcut();
	},
};

const controlPanelDisplayState = {
	controlPanelElement: document.querySelector(".control-panel"),
	controlPanelCurrentSessionNameElement: document.querySelector(
		"#currentSessionName",
	),
	controlPanelSessionListElement: document.querySelector("#session-list"),
	controlPanelExportSessionListElement:
		document.querySelector("#exportable-list"),
	controlPanelSessionHistoryElement: document.querySelector("#session-history"),

	renderCurrentSessionName: function (value) {
		this.controlPanelCurrentSessionNameElement.textContent = value;
	},

	renderSessionList: function () {
		this.controlPanelSessionListElement.replaceChildren();

		const sessionList = storageState.getSessionList();
		sessionList.forEach((session) => {
			const li = document.createElement("li");
			const button = document.createElement("button");
			button.textContent = session;
			button.addEventListener("click", () => {
				if (fieldState.isAllowedtoSwitchSession()) {
					storageState.loadSession(session);
					storageState.saveLastSession();
					this.renderCurrentSessionName(storageState.getCurrentSessionName());
					this.renderAllControlPanelList();

					return;
				}
				alert(
					"Please SAVE current work before switching or CANCEL if you want to abandon work",
				);
			});
			li.appendChild(button);
			this.controlPanelSessionListElement.appendChild(li);
		});
	},

	renderExportSessionList: function () {
		this.controlPanelExportSessionListElement.replaceChildren();
		const sessionList = storageState.getSessionList();
		sessionList.forEach((session) => {
			const li = document.createElement("li");
			const button = document.createElement("button");
			button.textContent = session;
			button.addEventListener("click", () => {
				this.renderSessionHistory(session);
			});
			li.appendChild(button);
			this.controlPanelExportSessionListElement.appendChild(li);
		});
	},

	renderSessionHistory: function (sessionName) {
		this.controlPanelSessionHistoryElement.replaceChildren();

		const exportAllButton = document.createElement("button");
		exportAllButton.textContent = "Export ALL";
		exportAllButton.addEventListener("click", () => exportSession(sessionName));

		this.controlPanelSessionHistoryElement.appendChild(exportAllButton);

		const sessionHistory = JSON.parse(localStorage.getItem(sessionName));

		sessionHistory.forEach((record) => {
			const button = document.createElement("button");
			button.textContent = `${record.ticketNumber} | ${record.fullName}`;
			button.addEventListener("click", () => {
				exportIndividualRecord(record);
			});
			this.controlPanelSessionHistoryElement.appendChild(button);
		});
	},

	renderAllControlPanelList: function () {
		console.log("render all called");
		this.renderSessionList();
		this.renderExportSessionList();
	},

	init: function () {
		const hideControlPanelButton = document.querySelector(
			"#hide-control-panel",
		);

		hideControlPanelButton.addEventListener("click", () => {
			if (this.controlPanelElement.style.display === "none") {
				this.controlPanelElement.style.display = "block";
				hideControlPanelButton.textContent = "HIDE CONTROL PANEL";
			} else {
				this.controlPanelElement.style.display = "none";
				hideControlPanelButton.textContent = "SHOW CONTROL PANEL";
			}
		});

		this.renderCurrentSessionName(storageState.getCurrentSessionName());

		this.renderAllControlPanelList();
	},
};

// UTILITIES //
async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
		alert("Text successfully copied!");
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
}

function noteTransform(data, isINC, isOB) {
	let ob = "";
	if (!isOB) {
		ob = `
== USER ==

Employee ID: ${data.OBemployeeId}
Name: ${data.OBfullName}
Email Address: ${data.OBemail}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBbestTimeToReach}
Location: ${data.OBlocation}
`;
	}

	if (isINC) {
		const notes = `
== CALLER == 

Employee ID: ${data.employeeId}
Name: ${data.fullName}
Email Address: ${data.email}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.bestTimeToReach}
Location: ${data.location}

${ob}

Existing Ticket? ${data.existingTicket}

Possible Major Incident? ${data.possibleMajorIncident}
Contact Type: ${data.contactType}
Machine Name: ${data.machineName}
Nexthink Checklist: ${data.nexthinkChecklist}

ISSUE DESCRIPTION:
${data.issueDescription}

MINIMUM DATA SET:
${data.resolutionNotes} 

KB Article: ${data.kbArticle}

Issue Resolved? ${data.issueResolved}
Next Action(s): ${data.nextActions}
User agreed to set data to Resolved? ${data.userAgreedResolved}`;

		return notes;
	}
	const notes = `
Employee ID: ${data.employeeId}
Name: ${data.fullName}
Email Address: ${data.email}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.bestTimeToReach}
Location: ${data.location}

Existing Ticket? ${data.existingTicket}

New Hire: ${data.newHire}
MFA Registered? ${data.mfaRegistered}
SSPR Offered? ${data.ssprOffered}
SSPR Outcome: ${data.ssprOutcome}

ISSUE DESCRIPTION:
${data.issueDescription}

RESOLUTION NOTES:
${data.resolutionNotes}

KB Article: ${data.kbArticle}
Ticket Fulfilled: ${data.ticketFulfilled}
Next Action(s): ${data.nextActions}

User agreed to fulfill ticket? ${data.userAgreedFulfill}`;

	return notes;
}

function exportSession(sessionName) {
	const records = JSON.parse(localStorage.getItem(sessionName)) || [];

	let textContent = "";

	records.forEach((ticket, index) => {
		textContent += `
========================================
Record #${index + 1}
========================================
== CALLER ==

Employee ID: ${ticket.employeeId}
Name: ${ticket.fullName}
User ID: ${ticket.userId}
Email Address: ${ticket.email}
Contact Number: ${ticket.contactNumber}
Best time to reach: ${ticket.bestTimeToReach}
Work Setup: ${ticket.workSetup}
Location: ${ticket.location}

== USER ==

Employee ID: ${ticket.OBemployeeId}
Name: ${ticket.OBfullName}
User ID: ${ticket.OBuserId}
Email Address: ${ticket.OBemail}
Contact Number: ${ticket.OBcontactNumber}
Best time to reach: ${ticket.OBbestTimeToReach}
Work Setup: ${ticket.OBworkSetup}
Location: ${ticket.OBlocation}

Existing Ticket? ${ticket.existingTicket}
Existing Ticket Number: ${ticket.existingTicketNumber}

New Hire: ${ticket.newHire}
MFA Registered? ${ticket.mfaRegistered}
SSPR Offered? ${ticket.ssprOffered}

User Declined SSPR? ${ticket.userDeclined}
User Declined Reason: ${ticket.userDeclinedReason}
User Attempted SSPR but Failed? ${ticket.userAttemptedSsprFailed}
User SSPR Failure Details: ${ticket.ssprFailureDetails}

ISSUE DESCRIPTION:
${ticket.issueDescription}

MINIMUM DATA SET:
${ticket.minimumDataSet}

KB Article: ${ticket.kbArticle}
Nexthink? ${ticket.nexthink}

Next Action(s): ${ticket.nextActions}

Issue Resolved? ${ticket.issueResolved}
User agreed to set ticket to Resolved?
${ticket.userAgreedResolved}
Resolution Notes: ${ticket.resolutionNotes}

Ticket #: ${ticket.ticketNumber}
`;
	});

	const blob = new Blob([textContent], {
		type: "text/plain",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `${sessionName}.txt`;

	a.click();

	URL.revokeObjectURL(url);
}

function exportIndividualRecord(ticket) {
	const textContent = `
========================================
Individual Record
========================================

== CALLER ==

Employee ID: ${ticket.employeeId}
Name: ${ticket.fullName}
User ID: ${ticket.userId}
Email Address: ${ticket.email}
Contact Number: ${ticket.contactNumber}
Best time to reach: ${ticket.bestTimeToReach}
Work Setup: ${ticket.workSetup}
Location: ${ticket.location}

== USER ==

Employee ID: ${ticket.OBemployeeId}
Name: ${ticket.OBfullName}
User ID: ${ticket.OBuserId}
Email Address: ${ticket.OBemail}
Contact Number: ${ticket.OBcontactNumber}
Best time to reach: ${ticket.OBbestTimeToReach}
Work Setup: ${ticket.OBworkSetup}
Location: ${ticket.OBlocation}

Existing Ticket? ${ticket.existingTicket}
Existing Ticket Number: ${ticket.existingTicketNumber}

New Hire: ${ticket.newHire}
MFA Registered? ${ticket.mfaRegistered}
SSPR Offered? ${ticket.ssprOffered}

User Declined SSPR? ${ticket.userDeclined}
User Declined Reason: ${ticket.userDeclinedReason}
User Attempted SSPR but Failed? ${ticket.userAttemptedSsprFailed}
User SSPR Failure Details: ${ticket.ssprFailureDetails}

ISSUE DESCRIPTION:
${ticket.issueDescription}

MINIMUM DATA SET:
${ticket.minimumDataSet}

KB Article: ${ticket.kbArticle}
Nexthink? ${ticket.nexthink}

Next Action(s): ${ticket.nextActions}

Issue Resolved? ${ticket.issueResolved}
User agreed to set ticket to Resolved?
${ticket.userAgreedResolved}
Resolution Notes: ${ticket.resolutionNotes}

Ticket #: ${ticket.ticketNumber}
`;

	const blob = new Blob([textContent], {
		type: "text/plain",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `${ticket.ticketNumber}.txt`;

	a.click();

	URL.revokeObjectURL(url);
}

function initCreateNewSessionForm() {
	const createSessionForm = document.querySelector("#createSessionForm");
	createSessionForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const newSessionName = formData.get("sessionName").trim();
		console.log(newSessionName);
		if (newSessionName === "") {
			alert("Session name cannot be empty!");
			return;
		}

		if (localStorage.getItem(newSessionName)) {
			alert("Session name already exists! Please choose a different name.");
			return;
		}

		localStorage.setItem(newSessionName, JSON.stringify([]));
		storageState.updateSessionList();
		controlPanelDisplayState.renderAllControlPanelList();
	});
}

function init() {
	window.addEventListener("beforeunload", (e) => {
		e.preventDefault();
	});

	const isFreshStart = !storageState.resumeLastSession();
	console.log(`isFreshStart: ${isFreshStart}`);
	if (isFreshStart) storageState.init();

	fieldState.init();
	controlPanelDisplayState.init();
	initCreateNewSessionForm();
}

function fillTestData() {
	document.querySelector("[name=employeeId]").value = "12345678";
	document.querySelector("[name=fullName]").value = "Kenjie Tarasona";
	document.querySelector("[name=userId]").value = "KDCRUZ";
	document.querySelector("[name=email]").value =
		"kenjie.tarasona@nationalgrid.com";
	document.querySelector("[name=contactNumber]").value = "09171234567";
	document.querySelector("[name=location]").value = "Marikina";

	document.querySelector("[name=issueDescription]").value =
		"User unable to sign in after password expiration.";

	document.querySelector("[name=minimumDataSet]").value =
		`Verified employee identity.
Validated employee ID.
Performed password reset via SSPR.
Confirmed successful login.`;

	document.querySelector("[name=kbArticle]").value = "KB123456";
	document.querySelector("[name=ticketNumber]").value = "INC1234567";
}

init();
document.querySelector("#fillTestData").addEventListener("click", fillTestData);
