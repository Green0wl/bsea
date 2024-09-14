const newCriteriaBtn = document.getElementById("new-criteria");
const newAlternativeBtn = document.getElementById("new-alternative");

newCriteriaBtn.addEventListener("click", newCriteria);
newAlternativeBtn.addEventListener("click", newAlternative);

const matrixFieldChangeCallback = () => {
	/** @type {HTMLInputElement[]} */
	const weightingRow = document
		.getElementById("weighting")
		.querySelectorAll("th>input");

	/** @type {number[]} */
	const weightingRowValueList = [];
	for (const input of weightingRow) {
		weightingRowValueList.push(Number.parseFloat(input.value));
	}

	const wsmScores = document.querySelectorAll("tbody>tr>td:last-child");
	for (const wsmScore of wsmScores) {
		const scoreParentRow = wsmScore.parentNode;

		/** @type {HTMLInputElement[]} */
		const scoreParentModifiers = [...scoreParentRow.children].slice(1, -1);

		/** @type {number[]} */
		const modifiersValueList = [];
		for (const modifier of scoreParentModifiers) {
			modifiersValueList.push(
				Number.parseFloat(modifier.querySelector("input").value),
			);
		}

		if (modifiersValueList.length !== weightingRowValueList.length) {
			throw new Error("Vectors must have the same length.");
		}

		wsmScore.querySelector("p").textContent = modifiersValueList.reduce(
			(sum, val, i) => sum + val * weightingRowValueList[i],
			0,
		);
	}
};
setFieldCallbacks();

function setFieldCallbacks() {
	/** @type {HTMLInputElement} */
	const matrixFields = document.querySelectorAll("input:not([disabled])");
	for (const field of matrixFields) {
		field.removeEventListener("change", matrixFieldChangeCallback);
		field.addEventListener("change", matrixFieldChangeCallback);
	}
}

function newCriteria() {
	const thead = document.querySelector("thead");
	const tbody = document.querySelector("tbody");
	if (!tbody || !thead) throw new Error("No <tbody> or <thead>.");

	const criteriaTh = thead.firstElementChild.querySelector("#criteria-th");

	const nextColspan = Number.parseInt(criteriaTh.getAttribute("colspan")) + 1;
	criteriaTh.setAttribute("colspan", nextColspan.toString());

	const weightingRow = document.getElementById("weighting");
	const currWeightNr = weightingRow.children.length - 2;
	const lastWeight = weightingRow.children[currWeightNr];
	const newWeight = lastWeight.cloneNode(true);

	const oldName = lastWeight.querySelector("input").getAttribute("name");
	const newName = oldName.replace(/\d+/, currWeightNr + 1);
	newWeight.querySelector("input").setAttribute("name", newName);

	const lastTh = weightingRow.lastElementChild;
	weightingRow.insertBefore(newWeight, lastTh);

	const criteriaNames = document.getElementById("criteria-inputs");
	const newCriteriaName = criteriaNames.lastElementChild.cloneNode(true);
	newCriteriaName.querySelector("input").setAttribute(
		"name",
		criteriaNames.lastElementChild
			.querySelector("input")
			.getAttribute("name")
			.replace(/\d+/, criteriaNames.children.length + 1),
	);
	newCriteriaName.querySelector("input").setAttribute(
		"value",
		criteriaNames.lastElementChild
			.querySelector("input")
			.getAttribute("value")
			.replace(/\d+/, criteriaNames.children.length + 1),
	);
	criteriaNames.appendChild(newCriteriaName);

	const alternatives = tbody.querySelectorAll("tr");
	for (const child of alternatives) {
		const prelastChild = child.children[child.children.length - 2];
		const newCriteriaTd = prelastChild.cloneNode(true);

		newCriteriaTd.querySelector("input").setAttribute(
			"name",
			prelastChild
				.querySelector("input")
				.getAttribute("name")
				.replace(/(?<=C)\d+/, child.children.length - 1),
		);

		child.insertBefore(newCriteriaTd, child.lastElementChild);
	}
	setFieldCallbacks();
}

function newAlternative() {
	const tbody = document.querySelector("tbody");
	if (!tbody) throw new Error("No <tbody>.");

	const lastRow = tbody.lastElementChild;
	if (!lastRow) throw new Error("No last child element.");

	const newRow = lastRow.cloneNode(true);

	const rowNumber = tbody.children.length + 1;
	newRow.id = `RA${rowNumber}`;

	/** @type {HTMLInputElement[]} */
	const inputs = newRow.querySelectorAll("input");
	for (const input of inputs) {
		const oldName = input.getAttribute("name");
		const newName = oldName.replace(/\d+/, rowNumber);
		input.setAttribute("name", newName);
		if (input.type === "text") {
			input.setAttribute("value", `A${rowNumber}`);
		} else {
			input.setAttribute("value", "0");
		}
	}

	const p = newRow.querySelector("p");
	p.id = `A${rowNumber}`;
	p.textContent = "0";

	tbody.appendChild(newRow);
	setFieldCallbacks();
}
