import path from "path";

const result = (req, res) => {
    const __dirname = path.resolve('/home/khubaib/Programing/Projects/AUTOMATED ANSWER SHEET ASSESSMENT SYSTEM/server');
    const filePath = path.join(__dirname, 'data', 'result.docx');
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading the file:', err);
      res.status(500).send('File download failed');
    }
  });
}

export { result };
