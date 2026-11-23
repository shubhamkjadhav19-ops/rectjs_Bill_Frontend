# Spectrum consignment note

A React form for entering the information from the supplied consignment-note PDF, with transporter details prefilled from the sample and editable. The Go API saves each consignment as JSON and generates a downloadable, three-page PDF containing the consignor, consignee, and driver copies using the original note's layout, logo, stamp, and printed wording.

## Requirements

- Node.js 18 or newer
- Go 1.22 or newer

### Install Go on Windows

The `go` command is missing when Go is not installed or the terminal has not picked up its PATH yet. In PowerShell, install Go with:

```powershell
winget install --id GoLang.Go --exact
```

After installation, close and reopen PowerShell (and VS Code, if it was open), then verify the installation:

```powershell
go version
```

If `winget` is unavailable, install Go 1.22 or newer from [go.dev/dl](https://go.dev/dl/) and reopen your terminal.

## Start the application

Once Go is installed, start the Go API:

```powershell
Set-Location C:\Project_Creating_bill\backend
go run .
```

In another terminal, install the frontend dependencies and start Vite:

```powershell
Set-Location C:\Project_Creating_bill
npm install
npm run dev
```

Open the address printed by Vite, usually `http://localhost:5173`.

The form submits to `POST /api/consignments`. The Go service validates required fields and stores each submission as a JSON file in `backend/data/consignments/` by default. After saving, the form requests `GET /api/consignments/{id}/pdf` and downloads all three copies in one PDF. The PDF background is embedded from `backend/templates/consignment-note.png`. `GET /api/consignments/{id}` retrieves a saved form and `GET /api/health` checks that the API is running. Set `DATA_DIR` to change the storage directory or `ADDR` to change the API listen address.
