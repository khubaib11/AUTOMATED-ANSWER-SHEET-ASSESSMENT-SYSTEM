import path from "path";

const result = (req, res) => {
    const __dirname = path.resolve('/home/khubaib/Programing/Projects/AUTOMATED ANSWER SHEET ASSESSMENT SYSTEM/server');
    const filePath = path.join(__dirname, 'data', 'result.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).send('File rendering failed');
      }
    });
}

export { result };
