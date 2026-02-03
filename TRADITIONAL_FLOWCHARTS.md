# Traditional Flowcharts - BBEK Application

Here is the traditional-style flowchart code for the BBEK system. You can copy these blocks into the [Mermaid Live Editor](https://mermaid.live/).

## 1. Account Management Flow
```mermaid
graph TD
    Start([ag]) --> Input[/Account Setting/]
    Input --> ChooseAction{If Choose New Account?}
    
    ChooseAction -- Yes --> IfAddNewUser{If Add New User?}
    IfAddNewUser -- Yes --> DB1[(db)]
    DB1 --> NewAcc[New Account is created]
    NewAcc --> ConnectorF((f))
    ConnectorF --> Start
    
    IfAddNewUser -- No --> ConnectorF
    
    ChooseAction -- No --> UpdateAcc{If Choose Update Account?}
    UpdateAcc -- Yes --> DB2[(db)]
    DB2 --> UpdateDet[Update the Details of Account]
    UpdateDet --> ConnectorM((m))
    
    UpdateAcc -- No --> UpdatePass{If Choose Update Password?}
    UpdatePass -- Yes --> DB3[(db)]
    DB3 --> UpdatePW[Update the Password]
    UpdatePW --> OwnAccCheck
    
    UpdatePass -- No --> ViewAcc{If Choose Accounts?}
    ViewAcc -- Yes --> ViewRec[View the Accounts]
    ViewRec --> OwnAccCheck{If Own Account?}
    
    OwnAccCheck -- Yes --> UpdateDet
    OwnAccCheck -- No --> PositionCheck{If Change the position?}
    PositionCheck -- Yes --> Updated[Updated]
    Updated --> ConnectorM
    PositionCheck -- No --> ConnectorM
    
    ViewAcc -- No --> TimeCheck{If Choose Time in / out?}
    TimeCheck -- Yes --> DB4[(db)]
    DB4 --> Audit[View the audit trail of accessing the system]
    Audit --> ExitCheck
    
    TimeCheck -- No --> ExitCheck{If Choose Exit?}
    ExitCheck -- Yes --> End([bi])
    ExitCheck -- No --> Start
```

## 2. Financial Management Flow
```mermaid
graph TD
    Start([af]) --> Input[/Financial Management/]
    Input --> CashCount{If Choose Cash Count?}
    
    CashCount -- Yes --> CountInc[Count the income]
    CountInc --> SaveCheck{If Save?}
    SaveCheck -- Yes --> PrintRec[Print and Add in Cash Receipt Record]
    PrintRec --> DB1[(db)]
    DB1 --> ConnectorEX((ex))
    SaveCheck -- No --> CashReceipt
    
    CashCount -- No --> CashReceipt{If Choose Cash Receipt?}
    CashReceipt -- Yes --> ViewRec[View and Print Record of income]
    ViewRec --> DB1
    
    CashReceipt -- No --> Expense{If Choose Expense?}
    Expense -- Yes --> ConnectorF((f))
    
    Expense -- No --> Report{If Choose Report?}
    Report -- Yes --> DB2[(db)]
    DB2 --> GenRep[Generate Report]
    GenRep --> ConnectorEX
    
    Report -- No --> Exit{If Choose Exit?}
    Exit -- Yes --> End([bf])
    Exit -- No --> Input
    
    ConnectorF --> CountExp{If Count Expense?}
    CountExp -- Yes --> SaveExp{If Save?}
    SaveExp -- Yes --> AddExp[Add in Record of Expense]
    AddExp --> ConnectorG((g))
    SaveExp -- No --> ConnectorG
    
    CountExp -- No --> WidDep{If Withdraw and Deposit?}
    WidDep -- Yes --> AddWD[Add New Record in Withdraw and Deposit]
    AddWD --> ConnectorEX
    WidDep -- No --> ConnectorEX
    
    ConnectorG --> Expense
    ConnectorEX --> End
```

## 3. Login to Baptism Performance Flow
```mermaid
graph TD
    Start([ad]) --> Input[/Login & Baptism Performance/]
    Input --> Login{If Login Success?}
    
    Login -- Yes --> BapAction{If Choose Baptism?}
    Login -- No --> Start
    
    BapAction -- Yes --> MemCheck{If is Member?}
    MemCheck -- Yes --> DB1[(db)]
    DB1 --> LinkMem[Link to Member Record]
    LinkMem --> StatusCheck
    
    MemCheck -- No --> InputDet[/Type Name and Details/]
    InputDet --> DB2[(db)]
    DB2 --> SaveTemp[Save Temporary Record]
    SaveTemp --> StatusCheck
    
    StatusCheck{If Performance Done?}
    StatusCheck -- Yes --> DB3[(db)]
    DB3 --> UpdateComp[Update Status to Completed]
    UpdateComp --> NewMemCheck{If was Non-Member?}
    
    NewMemCheck -- Yes --> AutoCreate[Auto-Create Member & Account]
    AutoCreate --> SendEmail[/Send Welcome Email/]
    SendEmail --> ConnectorEX((ex))
    
    NewMemCheck -- No --> SendConfirm[/Send Baptism Confirm/]
    SendConfirm --> ConnectorEX
    
    StatusCheck -- No --> ConnectorEX
    
    BapAction -- No --> Exit{If Choose Exit?}
    Exit -- Yes --> End([bd])
    Exit -- No --> Input
    
    ConnectorEX --> End
```
