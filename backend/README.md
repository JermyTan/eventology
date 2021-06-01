## Setup

Ensure you have [python 3.9](https://www.python.org/downloads/) installed on your local machine.

Then execute:

For mac, **`python3.9 -m venv venv`**

For windows, **`py -m venv venv`**

To create a virtual environment.

Next, depending on the platform and shell used in your local machine, execute the corresponding command to activate the virtual environment.

| Platform | Shell           | Command to activate venv           |
| -------- | --------------- | ---------------------------------- |
| POSIX    | bash/zsh        | \$ source venv/bin/activate        |
|          | fish            | \$ . venv/bin/activate.fish        |
|          | csh/tcsh        | \$ source venv/bin/activate.csh    |
|          | PowerShell Core | \$ venv/bin/Activate.ps1           |
| Windows  | cmd.exe         | C:\\> venv\Scripts\activate.bat    |
|          | PowerShell      | PS C:\\> venv\Scripts\Activate.ps1 |

For e.g. on Mac, run **`source venv/bin/activate`**

Finally, execute:

**`pip install --upgrade pip`**

**`pip install -r requirements.txt`**

To install all app dependencies.

## Run Development Server

**`python eventology/manage.py runserver`**

## Create migration

This step is required whenever there is a change in the django models.

**`python eventology/manage.py makemigrations`**

## Run migration

Once the migration code has been auto generated, the following command is executed to apply the migration.

**`python eventology/manage.py migrate`**
