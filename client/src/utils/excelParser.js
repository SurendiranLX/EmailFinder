import * as XLSX from 'xlsx';

export const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Extract emails (Simple regex search in all cells or assume specific column?)
                // Requirement says "Parse... to extract email addresses".
                // Let's flatten and find emails.
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emails = [];

                jsonData.forEach(row => {
                    row.forEach(cell => {
                        if (typeof cell === 'string' && emailRegex.test(cell.trim())) {
                            emails.push(cell.trim());
                        }
                    });
                });

                // Unique emails
                const uniqueEmails = [...new Set(emails)];
                resolve(uniqueEmails);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
