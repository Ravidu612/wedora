import PDFDocument from 'pdfkit';
import { calculateWeddingFinancials } from './calculationService.js';

export const generateBudgetPDF = async ({ wedding, expenses, payments, contributions }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const financials = calculateWeddingFinancials({
        totalBudget: wedding.totalBudget,
        expenses,
        payments,
        contributions,
        weddingDate: wedding.weddingDate,
      });

      const currency = wedding.currency || 'LKR';
      const fmt = (num) => `${currency} ${Number(num || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

      // Header Banner
      doc.rect(40, 40, 515, 60).fill('#FAF7F2');
      doc.fillColor('#C9A46A').fontSize(22).font('Helvetica-Bold').text('WEDORA', 55, 52);
      doc.fillColor('#78716C').fontSize(9).font('Helvetica').text('Smart Wedding Financial & Budget Report', 55, 78);
      doc.fillColor('#292524').fontSize(10).font('Helvetica-Bold').text(`${wedding.brideName} & ${wedding.groomName}`, 340, 55, { align: 'right', width: 200 });
      doc.fillColor('#78716C').fontSize(9).font('Helvetica').text(`Wedding Date: ${new Date(wedding.weddingDate).toLocaleDateString()}`, 340, 72, { align: 'right', width: 200 });

      doc.moveDown(3);

      // Financial Summary Box
      let y = 120;
      doc.fillColor('#292524').fontSize(14).font('Helvetica-Bold').text('Executive Financial Summary', 40, y);
      y += 20;

      const summaryCards = [
        { label: 'Total Allocated Budget', val: fmt(financials.totalBudget) },
        { label: 'Total Estimated Expenses', val: fmt(financials.totalEstimatedExpenses) },
        { label: 'Total Actual Expenses', val: fmt(financials.totalActualExpenses) },
        { label: 'Total Amount Paid', val: fmt(financials.totalPaid) },
        { label: 'Outstanding Balance', val: fmt(financials.totalOutstanding) },
        { label: 'Remaining Budget', val: fmt(financials.remainingBudget) },
      ];

      summaryCards.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const boxX = 40 + col * 260;
        const boxY = y + row * 45;

        doc.rect(boxX, boxY, 250, 38).fillAndStroke('#FFFFFF', '#E8D5D0');
        doc.fillColor('#78716C').fontSize(8).font('Helvetica').text(c.label, boxX + 10, boxY + 7);
        doc.fillColor('#292524').fontSize(11).font('Helvetica-Bold').text(c.val, boxX + 10, boxY + 20);
      });

      y += 150;

      // Expense Ownership Splits
      doc.fillColor('#292524').fontSize(12).font('Helvetica-Bold').text('Side-by-Side Allocation & Spending', 40, y);
      y += 18;

      const splits = [
        { side: 'Bride Side', actual: fmt(financials.brideExpenses) },
        { side: 'Groom Side', actual: fmt(financials.groomExpenses) },
        { side: 'Bride Family', actual: fmt(financials.brideFamilyExpenses) },
        { side: 'Groom Family', actual: fmt(financials.groomFamilyExpenses) },
        { side: 'Shared Expenses', actual: fmt(financials.sharedExpenses) },
        { side: 'Family Contributions Received', actual: fmt(financials.totalContributions) },
      ];

      splits.forEach((s) => {
        doc.fillColor('#78716C').fontSize(9).font('Helvetica').text(s.side, 45, y);
        doc.fillColor('#292524').fontSize(9).font('Helvetica-Bold').text(s.actual, 400, y, { align: 'right', width: 150 });
        doc.moveTo(40, y + 14).lineTo(555, y + 14).strokeColor('#F4ECE9').stroke();
        y += 20;
      });

      y += 15;

      // Expenses Table Header
      doc.fillColor('#292524').fontSize(12).font('Helvetica-Bold').text('Expense Line Items Breakdown', 40, y);
      y += 20;

      doc.rect(40, y, 515, 20).fill('#FAF7F2');
      doc.fillColor('#78716C').fontSize(8).font('Helvetica-Bold');
      doc.text('ITEM', 45, y + 5);
      doc.text('CATEGORY', 180, y + 5);
      doc.text('OWNER', 280, y + 5);
      doc.text('ACTUAL', 370, y + 5);
      doc.text('PAID', 440, y + 5);
      doc.text('STATUS', 505, y + 5);
      y += 22;

      // Rows
      expenses.slice(0, 15).forEach((exp) => {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }

        doc.fillColor('#292524').fontSize(8).font('Helvetica').text(exp.name.slice(0, 24), 45, y);
        doc.fillColor('#78716C').text((exp.category || 'Other').slice(0, 18), 180, y);
        doc.text(exp.expenseOwner || 'Shared', 280, y);
        doc.fillColor('#292524').text(Number(exp.actualAmount || 0).toLocaleString(), 370, y);
        doc.fillColor('#16A34A').text(Number(exp.paidAmount || 0).toLocaleString(), 440, y);
        doc.fillColor(exp.paymentStatus === 'Paid' ? '#16A34A' : '#DC2626').text(exp.paymentStatus || 'Unpaid', 505, y);

        doc.moveTo(40, y + 12).lineTo(555, y + 12).strokeColor('#F8F6F2').stroke();
        y += 16;
      });

      // Footer
      doc.fillColor('#78716C').fontSize(8).text(
        `Generated on ${new Date().toLocaleString()} by Wedora Smart Wedding Management System`,
        40,
        780,
        { align: 'center', width: 515 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

