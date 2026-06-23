**WorkNotes**

# Technicalities

This project is based on BetterNotes which I currently use for work github.com/Lain-lies/https://github.com/lain-lies/betternotes.
The code structure that is used here is the same one, except ofcourse for field conditions since there are two types but the storageState architecture remains the same.

# Usage

## 1. Sessions

- From the name itself it will serve as your storage for all the documentation that you made.
- When you save your documentation and clicked **new note** the data from that field will be saved on that session.
- You have the ability to add and switch session.

## 2. Exporting

- You're able to see the history of all the documentation you made for a certain session.
- Either you export individually or all of the documenation in that session.
- Exported file is a .txt file

## 3. Field

### 3.1 Caller Mode and Field Type

- Field has caller mode button to choose if its the caller itself or its on behalf
- Field has two type which is for INC and PWR documentation
- Depending on the type, the fields available for PWR is not available for INC or vice versa

### 3.2 Switch Click

- You may notice there are buttons in the field that has certain values.
- The text in the button is that field's current value. If the button is "Yes" then the value of that field will also be "Yes"
- Clicking the button will display its next value.

## 3.3 Issue Description

- The issue description field has a QOL feature, basically it auto adds a dash when you hit enter. Thats it.

## 3.4 Resolution Notes

- Resolution notes have 4 shortcut buttons
- The first two is for password reset. The only thing you will type is the account the user is requesting a reset for.
- Example: The user wants to reset his active directory account. Type "Active Directory" then hit verified or not verified depending on the scenario
- The typical details that GSD is entering will be automatically filled.

- The other two is for incident ticket
- Its a minor QOL feature that simply adds the last part of incident documentation whether it be, resolved or routed.

## 3.5 Saving and the Save Button

- Clicking save has two functions.
- 1: It will stage the data
- 2: It will be copied on your clipboard which means you can directly paste it anywhere
-
- **IMPORTANT ** Clicking save is just staging it or putting the data into a temporary container. It wont be permanently saved in the local storage.
- The reason why its designed like this is to allow modification. As an example if for some reason you forgot to add a detail on a resolution notes, you may add it then click save again.

## 3.6 New Note

- Clicking the new note button will permanently save the data from staging(or from the temporary container).
- From staging it will be moved to localStorage which has persistence. It will be available for export and will be shown in the history.

# Dev Note

- This project is still incomplete and there are certain features that I still want to add.
- The main purpose of this is for Quality of Life improvements.

Thank u :)
