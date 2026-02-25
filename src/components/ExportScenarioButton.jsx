import { Button, Dropdown } from 'antd';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function getScenarioFileName(clientName, ext) {
  const safeName = (clientName || '내담자').replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `상담시나리오_${safeName}_${date}.${ext}`;
}

function ExportScenarioButton({ clientName, size }) {
  const displayName = clientName || '내담자';

  const handlePdf = async () => {
    const el = document.getElementById('export-guidelines-section');
    if (!el) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const img = canvas.toDataURL('image/png');
      const imgHeight = Math.min((canvas.height * contentWidth) / canvas.width, 270);
      pdf.addImage(img, 'PNG', margin, 10, contentWidth, imgHeight);
    } catch (e) {
      console.error(e);
    }

    pdf.save(getScenarioFileName(displayName, 'pdf'));
  };

  const handleDocs = () => {
    const el = document.getElementById('export-guidelines-section');
    if (!el) return;

    const title = el.querySelector('.ant-card-head-title')
      ? el.querySelector('.ant-card-head-title').textContent
      : '상담 시나리오';
    const bodyHtml = el.querySelector('.ant-card-body')
      ? el.querySelector('.ant-card-body').innerHTML
      : el.innerHTML;

    const html = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Malgun Gothic, sans-serif; font-size: 11pt; line-height: 1.5; }
    .ant-typography { color: #595959; }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <div>${bodyHtml}</div>
</body>
</html>`;

    const blob = new Blob(['\uFEFF' + html], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getScenarioFileName(displayName, 'doc');
    a.click();
    URL.revokeObjectURL(url);
  };

  const items = [
    { key: 'pdf', label: 'PDF로 저장', onClick: handlePdf },
    { key: 'docs', label: 'DOC로 저장', onClick: handleDocs },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Button size={size} icon={<Download size={16} />}>
        상담 시나리오 내보내기
      </Button>
    </Dropdown>
  );
}

export default ExportScenarioButton;
