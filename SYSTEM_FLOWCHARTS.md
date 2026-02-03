# System Flowcharts - BBEK Application

This document provides a comprehensive set of flowcharts for the BBEK system, designed to match the logic of the actual codebase while following the visual and structural patterns provided in your examples.

## 1. Account Management Flow
This flow covers user authentication, account creation, updates, and the audit trail.
> [!NOTE]
> Mapped to `accountRoutes.js` and `auditTrailRoutes.js`.

```mermaid
graph TD
    Start([Start]) --> AccountSetting[Account Management Interaction]
    AccountSetting --> ChooseAction{Choose Action?}

    %% Path: New Account
    ChooseAction -- "New Account" --> IfAddNewUser{Add New User?}
    IfAddNewUser -- Yes --> CreateAcc[POST /createAccount]
    CreateAcc --> DB1[(Database: tbl_accounts)]
    DB1 --> AccCreated[New Account Created]
    AccCreated --> EndAcc([End])
    IfAddNewUser -- No --> AccountSetting

    %% Path: Update Account
    ChooseAction -- "Update Account" --> DB2[(Database: tbl_accounts)]
    DB2 --> UpdateDetails[PUT /updateAccount/:id]
    UpdateDetails --> UpdateSuccess[Account Details Updated]
    UpdateSuccess --> AccountSetting

    %% Path: Update Password
    ChooseAction -- "Update Password" --> DB3[(Database: tbl_accounts)]
    DB3 --> UpdatePass[PUT /updateAccount/:id - Password Hash]
    UpdatePass --> PassSuccess[Password Updated]
    PassSuccess --> AccountSetting

    %% Path: View Accounts
    ChooseAction -- "View Accounts" --> ViewAcc[GET /getAllAccounts]
    ViewAcc --> IfOwnAcc{If Own Account?}
    IfOwnAcc -- Yes --> UpdateDetails
    IfOwnAcc -- No --> ViewOnly[View Restricted Member Profile]
    ViewOnly --> AccountSetting

    %% Path: Time in/out (Audit Trail)
    ChooseAction -- "Audit Trail" --> DB4[(Database: tbl_audit_trail)]
    DB4 --> ViewAudit[GET /api/audit-trail/logs]
    ViewAudit --> AuditTrail[View User Activity History]
    AuditTrail --> AccountSetting

    %% Path: Exit
    ChooseAction -- "Exit" --> ExitCheck{If Choose Exit?}
    ExitCheck -- Yes --> FinalEnd([End Session])
    ExitCheck -- No --> AccountSetting
```

---

## 2. Financial Management Flow
Handles tithes, offerings, and general transactions.
> [!NOTE]
> Mapped to `tithesRoutes.js` and `transactionRoutes.js`.

```mermaid
graph TD
    Start([Start]) --> FinMgmt[Financial Management]
    FinMgmt --> ChooseFin{Choose Action?}

    %% Path: Tithes & Offerings
    ChooseFin -- "Tithes/Offerings" --> CountInc[POST /createTithe]
    CountInc --> IfSave{Save Record?}
    IfSave -- Yes --> PrintRec[Add to Tithes Record]
    PrintRec --> DB5[(Database: tbl_tithes)]
    DB5 --> EndFin([End])
    IfSave -- No --> FinMgmt

    %% Path: Records/Receipts
    ChooseFin -- "View Receipts" --> ViewRec[GET /getAllTithes]
    ViewRec --> PrintRec2[View and Print Record]
    PrintRec2 --> DB5
    
    %% Path: Expenses/Transactions
    ChooseFin -- "Transactions" --> TransAction{Process Transaction?}
    TransAction -- "Create" --> AddExp[POST /createTransaction]
    AddExp --> SaveExp{Save?}
    SaveExp -- Yes --> RecExp[Add to Transactions Record]
    RecExp --> DB6[(Database: tbl_transactions)]
    DB6 --> EndFin
    SaveExp -- No --> FinMgmt
    TransAction -- "Query" --> WithdrawDep{Withdraw/Deposit?}
    WithdrawDep -- Yes --> NewRecWD[Add Record in W/D]
    NewRecWD --> EndFin
    WithdrawDep -- No --> EndFin

    %% Path: Reports
    ChooseFin -- "Reports" --> DB_Report[(Database)]
    DB_Report --> GenReport[GET /getTotalsByServiceType]
    GenReport --> FinalReport[Generate Financial Summary]
    FinalReport --> EndFin

    %% Path: Exit
    ChooseFin -- "Exit" --> ExitFin{Exit?}
    ExitFin -- Yes --> FinalEnd([Logout])
    ExitFin -- No --> FinMgmt
```

---

## 3. Schedule of Events Flow
Includes coordination for Baptisms, Weddings, and general Church Calendar events.
> [!NOTE]
> Mapped to `eventRoutes.js`, `waterBaptismRoutes.js`, and `marriageServiceRoutes.js`.

```mermaid
graph TD
    Start([Start]) --> EventMgmt[Schedule of Events]
    EventMgmt --> ChooseEv{Select Type?}

    %% Path: Calendar
    ChooseEv -- "Calendar" --> DB7[(Database: tbl_events)]
    DB7 --> GenSch[GET /getAllEvents]
    GenSch --> NewSch[Create New Schedule]
    NewSch --> ConflictCheck{Conflict Check?}
    ConflictCheck -- Yes --> ConflictMsg[Show Conflict Alert]
    ConflictMsg --> GenSch
    ConflictCheck -- No --> SaveSch[Add to List of Schedule]
    SaveSch --> EventMgmt

    %% Path: Baptism
    ChooseEv -- "Baptism" --> DB8[(Database: tbl_water_baptisms)]
    DB8 --> GenBap[GET /getAllWaterBaptisms]
    GenBap --> NewSch
    
    %% Path: Wedding/Marriage
    ChooseEv -- "Wedding" --> DB9[(Database: tbl_marriage_services)]
    DB9 --> GenWed[GET /getAllMarriageServices]
    GenWed --> NewSch

    %% Path: Exit
    ChooseEv -- "Exit" --> ExitEv{Exit?}
    ExitEv -- Yes --> EndEv([Return to Dashboard])
    ExitEv -- No --> EventMgmt
```

---

## 4. Inventory & Archive Flow
While the system primarily uses Archive for record preservation, this flow represents the management of system records.
> [!NOTE]
> Mapped to `archiveRoutes.js`.

```mermaid
graph TD
    Start([Start]) --> InvMgmt[System Records / Inventory]
    InvMgmt --> Archive{Action?}

    %% Archive Logic
    Archive -- "Archive" --> DB10[(Database: tbl_archives)]
    DB10 --> GenArchive[GET /getAllArchives]
    GenArchive --> PrintInv[Generate List of Archived Records]
    PrintInv --> InvMgmt

    %% Delete Logic
    Archive -- "Delete" --> DeleteRec{Delete Record?}
    DeleteRec -- Yes --> Transfer[Transfer to Archive Record]
    Transfer --> ProcessArch[POST /api/archives/createArchive]
    ProcessArch --> InvMgmt
    DeleteRec -- No --> ExitInv{Exit?}

    ExitInv -- Yes --> EndInv([End])
    ExitInv -- No --> InvMgmt
```

---

## 5. Attendance & Visitation Flow (Integrated Plan)
This flow models the attendance logic integrated with member engagement and visitation trigger alerts.

```mermaid
graph TD
    Start([Start]) --> AttMgmt[Attendance & Visitation]
    AttMgmt --> ChooseAtt{Action?}

    %% Checking Path
    ChooseAtt -- "Checking" --> ServType[Type of Service/Activity]
    ServType --> DB11[(Database)]
    DB11 --> CheckAtt[Record Attendance Status]
    CheckAtt --> SaveAtt{Save?}
    SaveAtt -- Yes --> AbsCheck{2+ Consecutive Absences?}
    AbsCheck -- Yes --> AddVisit[Add to Visitation List]
    AddVisit --> EndAtt([End])
    AbsCheck -- No --> EndAtt
    SaveAtt -- No --> AttMgmt

    %% Visitation Path
    ChooseAtt -- "Visitation" --> DB12[(Database)]
    DB12 --> GenVisit[Generate List of Visitation]
    GenVisit --> VisitDone{Is Visitation Done?}
    VisitDone -- Yes --> VisBy[Record 'Visited By' Field]
    VisBy --> TransArch[Transfer into archive]
    TransArch --> EndAtt
    VisitDone -- No --> AttMgmt

    %% Reports
    ChooseAtt -- "Reports" --> DB_Att[(Database)]
    DB_Att --> GenAttRep[Generate Attendance Record Report]
    GenAttRep --> PrintList[Print Summary List]
    PrintList --> EndAtt

    %% Exit
    ChooseAtt -- "Exit" --> ExitAtt{Exit?}
    ExitAtt -- Yes --> EndAtt
    ExitAtt -- No --> AttMgmt
```
