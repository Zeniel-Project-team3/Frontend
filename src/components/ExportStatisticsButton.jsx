import { Button } from 'antd';
import { Download } from 'lucide-react';
import { Dropdown } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
  defaultJobMatchData,
  defaultSkillDistributionData,
  defaultSuccessRateData,
} from '../data/defaultDashboardData';

function getStatisticsFileName(clientName, ext) {
  const safeName = (clientName || '내담자').replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `분석및통계_${safeName}_${date}.${ext}`;
}

function ExportStatisticsButton({
  clientName,
  size,
  successRateData: successRateDataProp,
  jobMatchData: jobMatchDataProp,
  skillDistributionData: skillDistributionDataProp,
  similarCasesData: similarCasesDataProp,
}) {
  const displayName = clientName || '내담자';
  const successRateData = successRateDataProp ?? defaultSuccessRateData;
  const jobMatchData = jobMatchDataProp ?? defaultJobMatchData;
  const skillDistributionData = skillDistributionDataProp ?? defaultSkillDistributionData;
  const similarCasesData = similarCasesDataProp ?? [];

  const handlePdf = async () => {
    const el = document.getElementById('export-statistics-section');
    if (!el) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2; // 한 페이지에 들어갈 높이(mm)

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const img = canvas.toDataURL('image/png');
      const imgHeightMm = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeightMm;
      let position = 0;
      pdf.addImage(img, 'PNG', margin, margin, contentWidth, imgHeightMm);
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeightMm;
        pdf.addImage(img, 'PNG', margin, position, contentWidth, imgHeightMm);
        heightLeft -= contentHeight;
      }
    } catch (e) {
      console.error(e);
    }

    pdf.save(getStatisticsFileName(displayName, 'pdf'));
  };

  const handleExcel = () => {
    const wb = XLSX.utils.book_new();

    // 유사 스펙 취업 성공률 (표 형식: 구분 | 현재 성공률 | 평균 성공률)
    const SUCCESS_RATE_DATA = (successRateData || []).map((row) => ({
      구분: row?.name ?? '',
      '현재 성공률 (%)': row?.successRate ?? '',
      '평균 성공률 (%)': row?.avgRate ?? '',
    }));
    const wsSuccess = XLSX.utils.json_to_sheet(SUCCESS_RATE_DATA);
    wsSuccess['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsSuccess, '유사 스펙 취업 성공률');

    // 직무별 매칭 점수 (표 형식)
    const JOB_MATCH_DATA = (jobMatchData || []).map((row) => ({
      직무: row?.name ?? '',
      '매칭 점수': row?.score ?? '',
    }));
    const wsJob = XLSX.utils.json_to_sheet(JOB_MATCH_DATA);
    wsJob['!cols'] = [{ wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsJob, '직무별 매칭 점수');

    // 역량별 분포 (표 형식)
    const SKILL_DISTRIBUTION_DATA = (skillDistributionData || []).map((row) => ({
      역량: row?.name ?? '',
      비율: row?.value ?? '',
    }));
    const wsSkill = XLSX.utils.json_to_sheet(SKILL_DISTRIBUTION_DATA);
    wsSkill['!cols'] = [{ wch: 16 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsSkill, '역량별 분포');

    // 비슷한 보유 역량의 취업 성공 경로 (웹 테이블과 동일한 열 순서·표 형식)
    const SIMILAR_CASES_DATA = (similarCasesData || []).map((row) => ({
      '취업 직무': row?.jobTitle ?? '',
      '최종 학력': row?.finalEducation ?? '',
      '핵심 자격/교육': row?.keyQualification ?? '',
      '평균 연봉': row?.avgSalary ?? '',
      '취업 성공 경로 요약': row?.successPath ?? '',
    }));
    const wsSimilar = XLSX.utils.json_to_sheet(SIMILAR_CASES_DATA);
    wsSimilar['!cols'] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 14 },
      { wch: 42 },
    ];
    XLSX.utils.book_append_sheet(wb, wsSimilar, '취업 성공 경로');

    XLSX.writeFile(wb, getStatisticsFileName(displayName, 'xlsx'));
  };

  const items = [
    { key: 'pdf', label: 'PDF로 저장', onClick: handlePdf },
    { key: 'excel', label: 'Excel로 내보내기', onClick: handleExcel },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Button size={size} icon={<Download size={16} />}>
        분석 및 통계 내보내기
      </Button>
    </Dropdown>
  );
}

export default ExportStatisticsButton;
