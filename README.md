#  GRAMPay – Pay Anywhere, Even Without a Network

### An Offline-First Digital Payment Solution for Rural Communities

**GRAMPay** is an innovative offline-first digital payment platform designed to make digital financial services accessible in rural areas with limited or unreliable internet connectivity.

It aims to enable users to exchange payment records without continuous internet access using QR codes, Bluetooth communication and a unique **Village Mesh Relay** system.

Our goal is to bridge the digital financial gap and promote financial inclusion by making digital payments more accessible, reliable and user-friendly.

---

##  Problem Statement

Millions of people in rural areas face unreliable or limited internet connectivity, making it difficult to access digital financial services.

Traditional digital payment applications depend on internet connectivity for transaction processing, creating barriers for farmers, small shopkeepers and people living in remote areas.

GRAMPay aims to address this challenge through an offline-first payment approach.

##  Our Solution

GRAMPay introduces a smart offline payment ecosystem that allows users to create and exchange payment records even without an active internet connection.

The application combines:

- **Offline QR Payments:** Exchange payment information using QR codes.
- **Bluetooth Communication:** Transfer transaction records between nearby devices.
- **Offline Transaction Storage:** Store pending transactions locally until connectivity returns.
- **Village Mesh Relay:** Forward transaction records through participating devices until they reach an internet-connected relay.
- **Voice-Based Payments:** Make payment interactions easier using voice commands.
- **Smart Synchronization:** Synchronize and verify pending transaction records when internet becomes available.

**Our vision:** Your network connection should never be a barrier to financial inclusion.

---

##  Key Features

### 1. Offline QR Payments
- Scan merchant QR codes.
- Enter the payment amount.
- Generate unique transaction records.
- Store transactions locally without internet.

### 2. Bluetooth-Based Communication
- Discover compatible nearby devices.
- Exchange signed transaction records.
- Transfer payment information without mobile data.

### 3. Village Mesh Relay
- Transfer transaction records through participating devices.
- Store and forward records securely.
- Synchronize records when an internet connection becomes available.

### 4. Offline Transaction Management
- Store transaction records locally.
- Generate unique transaction IDs.
- Track pending transactions.
- Detect duplicate submissions.
- Synchronize automatically when connectivity returns.

### 5. Voice Payment Assistant
- Support voice-based payment commands.
- Extract payment amount and recipient.
- Provide spoken confirmation.
- Designed for future regional-language support.

### 6. Customer and Merchant Dashboards
- View demo wallet balance.
- Generate and scan QR codes.
- View transaction history.
- Monitor connectivity.
- Track transaction synchronization status.

---

##  How It Works

1. The merchant generates a QR code.
2. The customer scans the QR code.
3. The customer enters the payment amount and confirms.
4. GRAMPay creates a unique, digitally signed transaction record.
5. The record is exchanged using Bluetooth or a QR receipt fallback.
6. Both devices store the transaction locally.
7. If necessary, nearby relay devices carry the transaction record.
8. When internet becomes available, the record is sent to the backend for verification.
9. The transaction status is updated based on the verification result.

**Note:** An offline transaction record is not an immediate bank transfer. Transactions remain pending until verified and settled through the authorized payment system. GRAMPay is a hackathon prototype using simulated wallet balances, not a live UPI or banking application.

---

##  System Architecture

```text
             GRAMPay Application
                     |
          +----------+----------+
          |                     |
     Customer App          Merchant App
          |                     |
          +----------+----------+
                     |
              QR / Bluetooth
                     |
             Offline Transaction
                     |
              Local Storage
                (IndexedDB)
                     |
              Village Mesh
                  Relay
                     |
              Internet Available
                     |
              FastAPI Backend
                     |
          Transaction Verification
                     |
             PostgreSQL DB
                     |
           Transaction Status
          Verified / Rejected
```

---



##  Security and Reliability

GRAMPay focuses on secure transaction record exchange through:

- Unique transaction identifiers.
- Digital signatures.
- Password hashing.
- Input validation.
- Duplicate transaction detection.
- Offline spending limits.
- Secure transaction synchronization.
- Server-side transaction verification.

**Important limitation:** Offline devices cannot independently guarantee that the same funds have not been spent elsewhere. The prototype uses simulated balances, conservative offline limits and server-side reconciliation. It does not guarantee fraud-free offline banking.

---

##  Development Roadmap

| Phase | Development |
|---|---|
| Phase 1 | Project setup and landing page |
| Phase 2 | Authentication and dashboards |
| Phase 3 | QR payment system |
| Phase 4 | Offline transaction management |
| Phase 5 | Bluetooth and Village Mesh Relay |
| Phase 6 | Voice assistant, testing and final improvements |

---

##  Future Scope

- Integration with authorized banking and payment infrastructure.
- Support for regional languages such as Kannada and Hindi.
- Improved offline security and device authentication.
- Expansion of the Village Mesh Relay network.
- Support for additional rural financial services.
- Collaboration with rural banks and cooperative societies.

---

##  Impact

GRAMPay aims to:

- Improve financial inclusion in rural communities.
- Reduce dependency on continuous internet connectivity.
- Make digital payments easier for farmers and small businesses.
- Encourage digital financial literacy.
- Support accessible and inclusive financial technology.

---


---

##  Conclusion

GRAMPay is more than a digital payment interface. It is a step towards making financial services accessible even in areas where internet connectivity is a challenge.

By combining offline-first technology, QR codes, Bluetooth communication and Village Mesh Relay, we aim to create a more connected and financially inclusive rural ecosystem.

###  GRAMPay – Pay Anywhere, Even Without a Network.

---

 