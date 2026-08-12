const { PDFDocument, PDFName, PDFArray, PDFHexString } = require('pdf-lib');
const fs = require('fs');

function stringToHex(str) {
    // 将 UTF-16BE 编码的字符串转为十六进制
    const codePoints = [];
    codePoints.push(0xFEFF); // UTF-16 BOM
    for (let i = 0; i < str.length; i++) {
        codePoints.push(str.charCodeAt(i));
    }
    
    const bytes = [];
    for (const cp of codePoints) {
        bytes.push((cp >> 8) & 0xFF);
        bytes.push(cp & 0xFF);
    }
    
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function test() {
    // 读取测试PDF
    const existingPdfBytes = fs.readFileSync('./test_input.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    const pageCount = pdfDoc.getPageCount();
    console.log(`PDF页数: ${pageCount}`);
    
    // 创建所有 outline 条目
    const outlineRefs = [];
    for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const pageRef = page.ref;
        
        // 创建目标数组
        const destArray = pdfDoc.context.obj([
            pageRef,
            PDFName.of('Fit')
        ]);
        
        // 使用 UTF-16BE 编码的十六进制字符串
        const titleHex = stringToHex(`第 ${i + 1} 页`);
        const titleString = PDFHexString.of(titleHex);
        
        const outlineDict = pdfDoc.context.obj({
            Title: titleString,
            Parent: null,
            Dest: destArray
        });
        
        const outlineRef = pdfDoc.context.register(outlineDict);
        outlineRefs.push(outlineRef);
        console.log(`创建书签: 第 ${i + 1} 页, hex: ${titleHex.substring(0, 30)}...`);
    }
    
    // 设置 Next 和 Prev 指针
    for (let i = 0; i < outlineRefs.length; i++) {
        const dict = pdfDoc.context.lookup(outlineRefs[i]);
        
        if (i > 0) {
            dict.set(PDFName.of('Prev'), outlineRefs[i - 1]);
        }
        if (i < outlineRefs.length - 1) {
            dict.set(PDFName.of('Next'), outlineRefs[i + 1]);
        }
    }
    
    // 创建 Outlines 根对象
    const outlinesDict = pdfDoc.context.obj({
        Type: PDFName.of('Outlines'),
        First: outlineRefs[0],
        Last: outlineRefs[outlineRefs.length - 1],
        Count: pageCount
    });
    
    const outlinesRef = pdfDoc.context.register(outlinesDict);
    
    // 设置每个 outline 条目的 Parent
    for (const outlineRef of outlineRefs) {
        const dict = pdfDoc.context.lookup(outlineRef);
        dict.set(PDFName.of('Parent'), outlinesRef);
    }
    
    // 设置文档的 Outlines 引用
    pdfDoc.catalog.set(PDFName.of('Outlines'), outlinesRef);
    
    console.log('书签结构已设置');
    
    // 保存 PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('./test_output_v4.pdf', pdfBytes);
    console.log('测试PDF已保存: test_output_v4.pdf');
}

test().catch(console.error);
