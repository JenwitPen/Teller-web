
create project name is Teller-web using Vite + TypeScript  + Ant Design + node 24
Theame is #3e71e8 , #E59A42 , #1C2862  background is #FFFFFF

รีวิว api จาก /Users/ingkwan/MyProject/Teller
Front-end ได้ดังนี้ครับ:

หมวดที่ 1: การจัดการการเข้าถึงระบบ (Authentication)
จำนวนหน้า: 1 หน้า

Page: Login (POST /login)
ใช้สำหรับยืนยันตัวตนเจ้าหน้าที่ (Username/Password)
รองรับระบบ Single Session (เตะเครื่องเก่าออกเมื่อมีการรันซ้อน)
จัดการเรื่อง Role-based access (ADMIN / TELLER)
มี pop up error message จาก api 

หมวดที่ 2: หน้าหลัก (Landing) หลังจาก login ผ่าน
 - have menu left page 
    - การจัดการบัญชีเงินฝาก (Account Management)
    - การทำธุรกรรม (Banking Operations)
    - รายงานและประวัติธุรกรรม (Reports & History)

 - Top bar right page have employee_id, username and role
 - Top bar right page have logout button (POST /logout)


หมวดที่ 3: การจัดการบัญชีเงินฝาก (Account Management)
จำนวนหน้า: 3 หน้า

Page: Account Search & Listing (หน้าหลัก) (GET /accounts)
ใช้แสดงรายการบัญชีทั้งหมดแบบแบ่งหน้า (Pagination)
มีช่อง Search สำหรับกรอก account_id,เลือก branch_code หรือ account_type

Page: Create New Account (POST /accounts)
หน้าจอสำหรับเปิดบัญชีใหม่ รับค่า ชื่อ, ยอดเงินเริ่มต้น, ประเภทบัญชี (SAVINGS/CURRENT/FIXED_DEPOSIT) และรหัสสาขา

Page: Edit Account Detail (POST /accounts/edit)
หน้าจอสำหรับแก้ไขข้อมูลบัญชี เช่น การเปลี่ยนชื่อบัญชี, แก้ไขสถานะ (ACTIVE/LOCKED/CLOSED), หรือตั้งค่าอื่นๆ

Page: View Account Detail (GET /accounts/{account_id})
หน้าจอสำหรับแสดงรายละเอียดบัญชี by account_id

หมวดที่ 4: การทำธุรกรรม (Banking Operations)
จำนวนหน้า: 1 หน้า

Page: Deposit / Withdraw Operation (POST /accounts/balance/v2)
หน้าจอสำหรับเจ้าหน้าที่ Teller เพื่อกรอกรายการฝากหรือถอนเงิน
มีการใช้ระบบ Lock (Redis) เพื่อป้องกันกระเป๋าเงินติดลบในกรณีทำรายการพร้อมกัน


หมวดที่ 5: รายงานและประวัติธุรกรรม (Reports & History) 
จำนวนหน้า: 1 หน้า

Page: Transaction History View (GET /transaction-history)
หน้าแสดงตารางประวัติธุรกรรมย้อนหลังของแต่ละบัญชี
รองรับการ Filter ตามเดือน ย้อนหลัง 3 เดือน และ ประเภทรายการ (DEPOSIT/WITHDRAW)
ถ้าไม่ search หรือ select ไม่ได้ filter ให้แสดงทั้งหมด
page แสดง 10 รายการ
ปุ่ม clear search
ตาราง แสดง account_id, account_name, transaction_type, amount, transaction_date (date format yyyy-mm-dd hh:mm:ss)
