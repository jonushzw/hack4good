import React from 'react';
import { CSSProperties } from "react";
import { FaTicketAlt } from 'react-icons/fa'; // Ensure this import is correct

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Purchased",
    itemName: "Item A",
    vouchersUsed: 2,
  },
  {
    invoice: "INV002",
    paymentStatus: "Preordered",
    itemName: "Item B",
    vouchersUsed: 1,
  },
  {
    invoice: "INV003",
    paymentStatus: "Purchased",
    itemName: "Item C",
    vouchersUsed: 3,
  },
  {
    invoice: "INV004",
    paymentStatus: "Purchased",
    itemName: "Item D",
    vouchersUsed: 4,
  },
  {
    invoice: "INV005",
    paymentStatus: "Preordered",
    itemName: "Item E",
    vouchersUsed: 2,
  },
  {
    invoice: "INV006",
    paymentStatus: "Purchased",
    itemName: "Item F",
    vouchersUsed: 1,
  },
  {
    invoice: "INV007",
    paymentStatus: "Purchased",
    itemName: "Item G",
    vouchersUsed: 3,
  },
];

export default function Profile() {
  const vouchers = 10; 
  const totalVouchersUsed = invoices.reduce((total, invoice) => total + invoice.vouchersUsed, 0);

  return (
    <div style={styles.container}>
      <header style={styles.headerBar}>
        <h1 style={styles.header}>My Profile</h1> 
      </header>
      <div style={styles.voucherBox}>
        <FaTicketAlt style={styles.icon} />
        <span style={styles.voucherText}>Vouchers Available: {vouchers}</span>
      </div>
      <div style={styles.tableContainer}>
        <h2 style={styles.transactionHistoryText}>Your Transaction History</h2> 
        <Table style={styles.table}> 
          <TableHeader>
            <TableRow>
                <TableHead className="w-[25%]">Invoice Number</TableHead>
                <TableHead className="w-[25%]">Status</TableHead>
                <TableHead className="w-[25%]">Item Name</TableHead>
                <TableHead className="w-[25%] text-right">Vouchers Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.itemName}</TableCell>
                <TableCell className="text-right">{invoice.vouchersUsed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Vouchers Used</TableCell>
              <TableCell className="text-right">{totalVouchersUsed}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    width: '100%', 
  },
  headerBar: { 
    marginBottom: '20px',
  },
  header: { 
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  voucherBox: { 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px', 
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    textAlign: 'center',
  },
  icon: { 
    fontSize: '24px',
    marginRight: '10px',
  },
  voucherText: { 
    fontSize: '20px',
  },
  tableContainer: { 
    marginTop: '10px', 
    width: '100%',
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
  },
  transactionHistoryText: {
    fontSize: '20px',
    textAlign: 'left',
    marginBottom: '10px', 
    textDecoration: 'underline', 
  },
};