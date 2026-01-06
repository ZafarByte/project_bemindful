"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchStressSummary, getDailyCheckinHistory } from "@/lib/api/stress";
import { format } from "date-fns";
import { useSession } from "../../../lib/context/session-context";

export function ReportDownloadButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useSession();

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Fetch data
      const token = localStorage.getItem("token");
      const [summary, history, userRes] = await Promise.all([
        fetchStressSummary(),
        getDailyCheckinHistory({ limit: 30 }),
        token ? fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : null) : Promise.resolve(null)
      ]);

      const currentUser = userRes?.user || user;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const primaryColor = [56, 189, 168]; // Teal
      const secondaryColor = [100, 116, 139]; // Slate Gray
      const lightBgColor = [248, 250, 252]; // Very light gray

      // Helper: Draw Rounded Card
      const drawCard = (x: number, y: number, w: number, h: number) => {
        doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
        doc.roundedRect(x, y, w, h, 3, 3, 'F');
      };

      // --- PAGE 1: COVER PAGE ---
      
      // Centered Logo
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      
      // Draw Logo (Scaled up)
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(3);
      doc.setLineCap("round");
      const logoY = centerY - 40;
      doc.line(centerX, logoY - 10, centerX, logoY + 10);
      doc.line(centerX + 8, logoY - 20, centerX + 8, logoY + 20);
      doc.line(centerX + 16, logoY - 15, centerX + 16, logoY + 15);
      doc.line(centerX + 24, logoY - 7, centerX + 24, logoY + 7);
      // Mirror left side
      doc.line(centerX - 8, logoY - 20, centerX - 8, logoY + 20);
      doc.line(centerX - 16, logoY - 15, centerX - 16, logoY + 15);
      doc.line(centerX - 24, logoY - 7, centerX - 24, logoY + 7);

      // Product Name
      doc.setFontSize(32);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("BeMindful", centerX, logoY + 40, { align: "center" });

      // Tagline
      doc.setFontSize(14);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text("Your Personal Mental Wellness Companion", centerX, logoY + 50, { align: "center" });

      // Report Title
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Mental Wellness Assessment Report", centerX, logoY + 80, { align: "center" });

      // Date
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${format(new Date(), "PPP")}`, centerX, logoY + 95, { align: "center" });

      // Footer Disclaimer (Small)
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text("Confidential & Private", centerX, pageHeight - 15, { align: "center" });


      // --- PAGE 2: SUMMARY & INSIGHTS ---
      doc.addPage();
      
      // Header (Small Logo Top Left)
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(14, 15, 14, 19);
      doc.line(16, 13, 16, 21);
      doc.line(18, 14, 18, 20);
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("BeMindful", 22, 18);
      
      // Page Title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Executive Summary", 14, 35);

      let yPos = 45;

      // 1. User Profile Summary (Card)
      drawCard(14, yPos, pageWidth - 28, 35);
      
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("NAME", 20, yPos + 10);
      doc.text("AGE", 80, yPos + 10);
      doc.text("GENDER", 120, yPos + 10);
      doc.text("ASSESSMENT PERIOD", 160, yPos + 10);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(currentUser?.name ? currentUser.name.replace(/\b\w/g, (l: string) => l.toUpperCase()) : "N/A", 20, yPos + 20);
      doc.text(summary.baselineAnswers?.age ? `${summary.baselineAnswers.age}` : "N/A", 80, yPos + 20);
      doc.text(summary.baselineAnswers?.gender ? `${summary.baselineAnswers.gender}` : "N/A", 120, yPos + 20);
      doc.text("Last 30 Days", 160, yPos + 20);

      yPos += 45;

      // 2. Key Metrics (Grid)
      const cardWidth = (pageWidth - 28 - 10) / 3; // 3 cards
      
      // Card 1: Current Score
      drawCard(14, yPos, cardWidth, 40);
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text("CURRENT WELLNESS SCORE", 20, yPos + 10);
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      const currentScore = summary.latestDaily?.moodScore ? Math.round(summary.latestDaily.moodScore) : 0;
      doc.text(`${currentScore}/100`, 20, yPos + 25);

      // Card 2: Stress Category
      drawCard(14 + cardWidth + 5, yPos, cardWidth, 40);
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text("STRESS CATEGORY", 20 + cardWidth + 5, yPos + 10);
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      // Determine category
      let category = "Moderate";
      if (currentScore >= 80) category = "Low Stress";
      else if (currentScore >= 60) category = "Mild Stress";
      else if (currentScore >= 40) category = "Moderate Stress";
      else category = "High Stress";
      doc.text(category, 20 + cardWidth + 5, yPos + 25);

      // Card 3: Active Streak
      drawCard(14 + (cardWidth + 5) * 2, yPos, cardWidth, 40);
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text("ACTIVE STREAK", 20 + (cardWidth + 5) * 2, yPos + 10);
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text(`${summary.streak} Days`, 20 + (cardWidth + 5) * 2, yPos + 25);

      yPos += 50;

      // Interpretation Text
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      let interpretation = "";
      if (currentScore >= 80) interpretation = "Your mental wellness indicators are currently very positive. You are demonstrating strong resilience and emotional balance.";
      else if (currentScore >= 60) interpretation = "You are maintaining a generally healthy mental wellness state, though there may be minor areas for improvement in your daily routine.";
      else if (currentScore >= 40) interpretation = "Your wellness scores indicate some moderate challenges. It may be beneficial to focus on specific lifestyle factors to improve your overall well-being.";
      else interpretation = "Your recent indicators suggest you may be experiencing significant stress. We recommend prioritizing self-care and considering professional support if these feelings persist.";
      
      const splitInterp = doc.splitTextToSize(interpretation, pageWidth - 28);
      doc.text(splitInterp, 14, yPos);
      yPos += (splitInterp.length * 6) + 10;

      // 3. Baseline Lifestyle Assessment
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Baseline Lifestyle Assessment", 14, yPos);
      yPos += 8;

      if (summary.baselineAnswers) {
        const answers = summary.baselineAnswers;
        const baselineData = [
          ["Sleep Duration", answers.sleepDuration ? `${answers.sleepDuration} hours` : "N/A"],
          ["Sleep Quality", answers.sleepQuality ? `${answers.sleepQuality}/4` : "N/A"],
          ["Screen Time", answers.screenTime ? `${answers.screenTime} hours` : "N/A"],
          ["Physical Activity", answers.physicalActivity ? `${answers.physicalActivity} days/week` : "N/A"],
          ["Work Stress", answers.workStress ? `${answers.workStress}/4` : "N/A"],
          ["Social Interaction", answers.socialInteraction ? `${answers.socialInteraction}/4` : "N/A"],
        ];

        autoTable(doc, {
          startY: yPos,
          head: [["LIFESTYLE FACTOR", "REPORTED VALUE"]],
          body: baselineData,
          theme: 'plain',
          styles: { 
            fontSize: 10, 
            cellPadding: 6,
            lineColor: [240, 240, 240],
            lineWidth: { bottom: 0.5 }
          },
          headStyles: { 
            fillColor: [248, 250, 252],
            textColor: secondaryColor,
            fontStyle: 'bold',
            fontSize: 9
          },
          columnStyles: {
            1: { halign: 'right', fontStyle: 'bold' }
          }
        });
      }

      // --- PAGE 3: RECOMMENDATIONS ---
      doc.addPage();

      // Header
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(14, 15, 14, 19);
      doc.line(16, 13, 16, 21);
      doc.line(18, 14, 18, 20);
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("BeMindful", 22, 18);
      
      yPos = 35;

      // 4. Key Insights & Recommendations
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Personalized Recommendations", 14, yPos);
      yPos += 10;

      const suggestions = [];
      const answers = summary.baselineAnswers || {};
      if (answers.sleepDuration && answers.sleepDuration < 7) suggestions.push("Prioritize Sleep: Aim for 7-9 hours of quality sleep to enhance cognitive function and emotional regulation.");
      if (answers.sleepQuality && answers.sleepQuality < 3) suggestions.push("Sleep Hygiene: Establish a consistent bedtime routine and limit blue light exposure before bed to improve sleep quality.");
      if (answers.screenTime && answers.screenTime >= 4) suggestions.push("Digital Detox: Implement the 20-20-20 rule (every 20 mins, look 20ft away for 20s) to reduce digital eye strain and mental fatigue.");
      if (answers.physicalActivity !== undefined && answers.physicalActivity < 3) suggestions.push("Active Living: Incorporate at least 30 minutes of moderate physical activity 3-4 times a week to naturally boost mood-regulating neurotransmitters.");
      if (answers.workStress && answers.workStress >= 3) suggestions.push("Stress Management: Practice mindfulness or deep-breathing exercises during work breaks to manage high-stress periods effectively.");
      if (answers.socialInteraction && answers.socialInteraction < 3) suggestions.push("Social Connection: Schedule regular check-ins with friends or family to build a supportive social network.");
      if (suggestions.length === 0) suggestions.push("Maintenance: Continue your current healthy habits. Consistency is key to long-term mental wellness.");

      suggestions.forEach(suggestion => {
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.circle(18, yPos - 1.5, 1.5, 'F');
          
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          const splitText = doc.splitTextToSize(suggestion, pageWidth - 30);
          doc.text(splitText, 24, yPos);
          yPos += (splitText.length * 6) + 4;
      });


      // --- PAGE 4: TREND ANALYSIS ---
      doc.addPage();

      // Header
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("BeMindful", 22, 18);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(14, 15, 14, 19);
      doc.line(16, 13, 16, 21);
      doc.line(18, 14, 18, 20);

      yPos = 35;
      
      // 5. Mood Trend Analysis
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Mood Trend Analysis (30 Days)", 14, yPos);
      yPos += 10;

      // Graph Logic (Reused but styled cleaner)
      if (history.data && history.data.length > 0) {
        const graphHeight = 70;
        const marginLeft = 25; 
        const marginRight = 14;
        const graphBottom = yPos + graphHeight;
        const graphTop = yPos;
        const graphLeft = marginLeft;
        const graphRight = pageWidth - marginRight;
        const effectiveGraphWidth = graphRight - graphLeft;

        // Background for graph
        drawCard(14, yPos - 5, pageWidth - 28, graphHeight + 25);

        // Y-Axis Labels (0, 25, 50, 75, 100)
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);

        [0, 25, 50, 75, 100].forEach(val => {
            const y = graphBottom - (val / 100) * graphHeight;
            doc.text(val.toString(), graphLeft - 4, y + 1, { align: 'right' });
            doc.line(graphLeft, y, graphRight, y);
        });

        // Average Line (Dashed)
        const scores = history.data.map((d: any) => d.score);
        const avgScore = scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
        const avgY = graphBottom - (avgScore / 100) * graphHeight;
        
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Teal
        doc.setLineDash([2, 2], 0);
        doc.line(graphLeft, avgY, graphRight, avgY);
        doc.setLineDash([], 0); // Reset
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(7);
        doc.text(`Avg: ${Math.round(avgScore)}`, graphRight + 2, avgY + 1, { align: 'left' });

        // Plot points
        const points = history.data.slice().reverse(); // Oldest first
        if (points.length > 1) {
            const maxScore = 100;
            const xStep = effectiveGraphWidth / (points.length - 1);
            
            const coords = points.map((point, i) => ({
                x: graphLeft + i * xStep,
                y: graphBottom - (point.score / maxScore) * graphHeight,
                score: point.score,
                date: new Date(point.timestamp)
            }));

            // Area Fill
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
            doc.moveTo(coords[0].x, graphBottom);
            doc.lineTo(coords[0].x, coords[0].y);
            
            // Smooth curve fill
            for (let i = 0; i < coords.length - 1; i++) {
                const p0 = coords[i === 0 ? 0 : i - 1];
                const p1 = coords[i];
                const p2 = coords[i + 1];
                const p3 = coords[i + 2] || p2;
                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;
                doc.curveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            doc.lineTo(coords[coords.length - 1].x, graphBottom);
            doc.lineTo(coords[0].x, graphBottom);
            doc.fill();
            doc.setGState(new (doc as any).GState({ opacity: 1.0 }));

            // Line Stroke
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(1);
            doc.moveTo(coords[0].x, coords[0].y);
            for (let i = 0; i < coords.length - 1; i++) {
                const p0 = coords[i === 0 ? 0 : i - 1];
                const p1 = coords[i];
                const p2 = coords[i + 1];
                const p3 = coords[i + 2] || p2;
                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;
                doc.curveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            doc.stroke();

            // X-Axis Labels (More detailed)
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.setFont("helvetica", "normal");
            
            // Show ~5 labels
            const step = Math.max(1, Math.floor(coords.length / 5));
            coords.forEach((coord, i) => {
                if (i % step === 0 || i === coords.length - 1) {
                     doc.text(format(coord.date, "MMM d"), coord.x, graphBottom + 8, { align: 'center' });
                     doc.setDrawColor(200, 200, 200);
                     doc.line(coord.x, graphBottom, coord.x, graphBottom + 2);
                }
            });

            // Dots & Values (Detailed)
            coords.forEach((coord, index) => {
                // Draw dot
                doc.setFillColor(255, 255, 255);
                doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.setLineWidth(0.5);
                doc.circle(coord.x, coord.y, 1.5, 'FD');

                // Show value if it's Max, Min, or Last point
                const scores = history.data.map((d: any) => d.score);
                const maxScoreVal = Math.max(...scores);
                const minScoreVal = Math.min(...scores);
                const isMax = coord.score === maxScoreVal;
                const isMin = coord.score === minScoreVal;
                const isLast = index === coords.length - 1;

                if (isMax || isMin || isLast) {
                    doc.setFillColor(isLast ? primaryColor[0] : 255, isLast ? primaryColor[1] : 255, isLast ? primaryColor[2] : 255);
                    if (isLast) {
                         doc.circle(coord.x, coord.y, 2, 'F'); // Solid dot for last
                         doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                         doc.setFont("helvetica", "bold");
                    } else {
                         doc.setTextColor(100, 100, 100);
                         doc.setFont("helvetica", "normal");
                    }
                    
                    doc.setFontSize(8);
                    // Offset text to avoid overlapping line
                    const yOffset = (coord.score > 50) ? -4 : 6;
                    doc.text(Math.round(coord.score).toString(), coord.x, coord.y + yOffset, { align: 'center' });
                }
            });
        }
        yPos += graphHeight + 30;
      }

      // 6. Daily Check-in Summary (High Level)
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Daily Check-in Summary", 14, yPos);
      yPos += 10;

      // Calculate stats
      const totalCheckins = history.data.length;
      const scores = history.data.map((d: any) => d.score);
      const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      const maxScore = scores.length ? Math.round(Math.max(...scores)) : 0;
      const minScore = scores.length ? Math.round(Math.min(...scores)) : 0;

      const summaryData = [
        ["Total Check-ins", `${totalCheckins}`],
        ["Average Mood Score", `${avgScore}/100`],
        ["Highest Score", `${maxScore}/100`],
        ["Lowest Score", `${minScore}/100`]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["METRIC", "VALUE"]],
        body: summaryData,
        theme: 'plain',
        styles: { 
            fontSize: 11, 
            cellPadding: 6,
            lineColor: [240, 240, 240],
            lineWidth: { bottom: 0.5 }
        },
        headStyles: { 
            fillColor: [248, 250, 252],
            textColor: secondaryColor,
            fontStyle: 'bold',
            fontSize: 10
        },
        columnStyles: {
            1: { halign: 'right', fontStyle: 'bold' }
        }
      });

      // 6.5 Recent Activity (Last 7 Days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentData = history.data.filter((d: any) => new Date(d.timestamp) >= sevenDaysAgo);

      if (recentData.length > 0) {
          yPos = (doc as any).lastAutoTable.finalY + 15;
          
          // Check for page break
          if (yPos > pageHeight - 80) {
              doc.addPage();
              yPos = 35;
                // Header
                doc.setFontSize(12);
                doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.setFont("helvetica", "bold");
                doc.text("BeMindful", 22, 18);
                doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.setLineWidth(1);
                doc.line(14, 15, 14, 19);
                doc.line(16, 13, 16, 21);
                doc.line(18, 14, 18, 20);
          }

          doc.setFontSize(16);
          doc.setTextColor(40, 40, 40);
          doc.setFont("helvetica", "bold");
          doc.text("Recent Activity (Last 7 Days)", 14, yPos);
          yPos += 10;

          const recentTableData = recentData.map((entry: any) => {
            let wellness = entry.dailyScore;
            if (wellness > 1) wellness = wellness / 100;
            
            return [
                format(new Date(entry.timestamp), "MMM d, HH:mm"),
                Math.round(entry.score),
                entry.moodType || "-",
                (Math.round(wellness * 100)) + "%"
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: [["Date", "Mood", "Type", "Wellness"]],
            body: recentTableData,
            theme: 'striped',
            styles: { 
                fontSize: 10, 
                cellPadding: 5,
                lineColor: [240, 240, 240],
                lineWidth: { bottom: 0.5 }
            },
            headStyles: { 
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { halign: 'center' },
                3: { halign: 'right' }
            }
          });
      }

      // 7. Disclaimer (Footer)
      const footerY = pageHeight - 20;
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "italic");
      const disclaimer = "Disclaimer: This report is for informational purposes only and does not constitute a medical diagnosis or clinical advice. If you are experiencing a mental health crisis, please consult a qualified healthcare professional.";
      const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 28);
      doc.text(splitDisclaimer, 14, footerY);

      doc.save("bemindful-report.pdf");

    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={loading} variant="outline" className="gap-2">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      Download Report
    </Button>
  );
}
