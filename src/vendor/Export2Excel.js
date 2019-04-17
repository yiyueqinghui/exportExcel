/* eslint-disable */
require('script-loader!file-saver');
require('script-loader!@/vendor/Blob');
// import XLSX from 'xlsx'
// import XLSX from './dist/xlsx'
// var XLSX = require('./dist/xlsxfullmin');
import XLSX from 'xlsx-style'
import { debug } from 'util';
// import XLSX from '../../node_modules/xlsx-style/dist/xlsx.full.min'
let options = {
    tableCellStyle: { //单元格统一样式
        fill: {
                patternType: "none",
                fgColor: {rgb: "FF000000"},
                bgColor: {rgb: "FFFFFFFF"}
        },
        font: {
          name: '微软雅黑',
          sz: 10,
          color: {rgb: "#FF000000"},
          bold: false,
          italic: false,
          underline: false
        },
        alignment: {
            vertical: "center",
            horizontal: "center",
            indent:0,
            wrapText: true
        },
        border: {
          top: {style: "thin", color: {auto: 1}},
          right: {style: "thin", color: {auto: 1}},
          bottom: {style: "thin", color: {auto: 1}},
          left: {style: "thin", color: {auto: 1}}
        }
    },
    tableHeardStyle: {//表头样式
        fill: {
                // patternType: "none",
                fgColor: {rgb: "FFF5F7FA"},
                bgColor: {rgb: "FFFFFFFF"}
        },
        font: {
          name: '微软雅黑',
          sz: 10,
          color: {rgb: "FF000000"},
          bold: true,
          italic: false,
          underline: false
        },

        alignment: {
            vertical: "center",
            horizontal: "center",
            indent:0,
            wrapText: true
        },
        border: {
          top: {style: "thin", color: {auto: 1}},
          right: {style: "thin", color: {auto: 1}},
          bottom: {style: "thin", color: {auto: 1}},
          left: {style: "thin", color: {auto: 1}}
        }
    },
    wchFixed:5,//固定宽度
    wchPerfect:1,//比例宽度
    DIYStyle:{
        type:'row',//row、横向格式相同，col、纵向，cell、单元格
        style:[],//样式  如果是cell则style为数组[{r:横c:竖,style:样式}]
    }
};

/**对象深度克隆 */
function assign(target, varArgs) {
    if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (typeof nextSource[nextKey] === 'object') {
                    to[nextKey] = assign({},to[nextKey],nextSource[nextKey]);
                }else{
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
            }
            ;

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
function cloneObj(data){
    return JSON.parse(JSON.stringify(data))
}
//多重合并
function moreCellConect(list1,list2){
    let RStrList = [],colList = [];
     list1.forEach((item,index) => {
         let CStr = '';
         list2.forEach((item1,index1) => {
             if(JSON.stringify(item.s) === JSON.stringify(item1.s)){
                CStr = JSON.stringify(item.e);
                RStrList.push(JSON.stringify(item1.e));
                colList.push({s: {c: item.s.c, r: item.s.r}, e: {c: item.e.c, r: item1.e.r}});
                list1.remove(index);
                list2.remove(index1);
                return
             }
             if(CStr===JSON.stringify(item1.s)){
                list2.remove(index1);
                return
             }
         })
     })
     RStrList.forEach((item,index) => {
        list1.forEach((item1,index1) => {
            if(item === JSON.stringify(item1.s)){
                list1.remove(index);
                return
            }
        })
     })
     return [...list1,...list2,...colList]
}
function processStyle(style,R,C,opts){
    if(!opts||opts.length<=0){
         return style
    }
    for(let i=0;i<opts.length;i++){
        let item = opts[i];
        if(item.type === 'row'&&R === item.style.r){
            style = assign({},style,item.style.style)
         }else if(item.type === 'col'&&C === item.style.c){
            style = assign({},style,item.style.style)
         }else if(opts.type === 'cell'&&C === item.style.c&&R === item.style.r){
            style = assign({},style,item.style.style)
         }
    }
    return style
}
function sheet_from_array_of_arrays(data, opts) {
    var ws = {},listR=[],listC=[],rangeH={s: {c: 0, r: 0}, e: {c: 0, r: 0}},tempStr=data[0][0],tempRStr=data[0][0],tempC=0,tempR=0;
    var rangeR = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            let styleCell = {};
            if(R<opts.rangLen){
                styleCell = options.tableHeardStyle;
            }else{
                styleCell = JSON.parse(JSON.stringify(options.tableCellStyle));
            }
            //自定义样式
            if(opts.DIYStyle){
                styleCell = processStyle(styleCell,R,C,opts.DIYStyle);
             }
            //  let canStyle = parseInt(cell.v)===;^(\d|[1-9])(\.\d{1,2})?%$
            let cellList = cell.t == 's'?cell.v.split('.'):[];
             if(R>=opts.rangLen&&cell.t == 's'&&cell.v.indexOf('%')>0&&(parseInt(cellList[0])==cellList[0]&&parseInt(cellList[1])==cellList[1].split('%')[0])){
                 styleCell.numFmt = '0.00%';
                 cell.t='n';
                 cell.v = parseFloat(parseFloat(cell.v)/100);
             }
             else if(R>=opts.rangLen&&cell.t == 's'&&cell.v.indexOf('.')>0&&cell.v.indexOf('%')<0&&(parseInt(cellList[0])==cellList[0]&&parseInt(cellList[1])==cellList[1])){
                let num = '0.';
                for(var i=0;i<cell.v.split('.')[1].length;i++){
                    num+='0';
                }
                styleCell.numFmt = num;
                cell.t='n';
                cell.v = parseFloat(cell.v);
             }
             cell.s = styleCell;
            // 合并多列
            if(opts&&opts.rangLen&&R<opts.rangLen&&cell.v !== tempStr){
                if(C-rangeH.s.c>1&&tempR === R){
                    rangeH.e.c=C-1;
                    rangeH.e.r=tempR;
                    // console.log(cloneObj(rangeH));
                    listR.push(cloneObj(rangeH));
                }
                tempR = R;
                rangeH.s.c=C;
                rangeH.s.r=tempR;
                // console.log(tempStr);
                tempStr = cell.v;

            }
            if(opts&&opts.rangLen&&R<opts.rangLen&&C===(data[R].length-1)&&cell.v === tempStr&&C!==rangeH.s.c){
                // debugger
                rangeH.e.c=C;
                rangeH.e.r=tempR;
                listR.push(cloneObj(rangeH));
            }
            ws[cell_ref] = cell;
        }
    }

    if(opts&&opts.rangLen){//合并多行
        let dataRList = data[0];
        for(var C = 0; C<dataRList.length;++C){
            for(var R = 0;R<=opts.rangLen;++R){
                let cell = {v: data[R][C]};
                // console.log(cloneObj(tempRStr));
                if(cell.v !== tempRStr){
                    if(R-rangeR.s.r>1&&tempC === C){
                        rangeR.e.r=R-1;
                        rangeR.e.c=tempC;
                        // console.log(cloneObj(rangeR));
                        listC.push(cloneObj(rangeR));
                    }
                    tempC = C;
                    rangeR.s.r=R;
                    rangeR.s.c=tempC;
                    tempRStr = cell.v;
                }
            }
        }
    }

    let lists=[...listR,...listC];
    if(opts.RC){//合并多行多列
        lists = moreCellConect(listR,listC);
    }
    if(opts.DIYRange&&opts.DIYRange.length>0){//自定义合并
        lists = [...lists,...opts.DIYRange];
    }
    ws['!merges'] = lists;
    // console.log(lists);
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}


export function export_table_to_excel(id) {
    var theTable = document.getElementById(id);
    var oo = generateArray(theTable);
    var ranges = oo[1];

    /* original data */
    var data = oo[0];
    var ws_name = "SheetJS";

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});

    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx")
}

export function export_json_to_excel({header, data, filename='excel-list', autoWidth=true,RC,wsName,DIYRange,DIYStyle,callBack}={}) {
    /* original data */
    data=typeof [...header][0] === 'object'?[...header,...data]:[header,...data];
    let rangLen = typeof [...header][0] === 'object'?header.length:null;
    let opts = {
        rangLen:rangLen,
        RC:RC,
        DIYRange:DIYRange,
        DIYStyle
    };
    // data.unshift(...header);
    var ws_name = wsName||"SheetJS";
    // debugger
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data,opts);
    // debugger
    if(autoWidth){
      /*设置worksheet每列的最大宽度*/
      const colWidth = data.map(row => row.map(val => {
        /*先判断是否为null/undefined*/
        if(val instanceof Date){
            return {'wch': 15};
        }
        if (val == null) {
          return {'wch': options.wchFixed};
        }
        /*再判断是否为中文*/
        else if (val.toString().charCodeAt(0) > 255) {
          return {'wch': val.toString().length * options.wchPerfect*2};
        } else {
          return {'wch': val.toString().length * options.wchPerfect};
        }
      }))
      /*以第一行为初始值*/
      let result = colWidth[0];
      for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
          if (result[j]['wch'] < colWidth[i][j]['wch']) {
            result[j]['wch'] = colWidth[i][j]['wch'];
          }
        }
      }
    //   ws['!merges'] = [
    //       {e:{ c: 0, r: 0}, s:{ c: 1, r: 0}}
    //       {e:{ c: 3, r: 2}, s:{ c: 1, r: 2}}
    //       {e:{ c: 0, r: 1}, s:{ c: 3, r: 2}}
    //     ];
      ws['!cols'] = result;
    }
    // debugger;
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    callBack&&callBack();
    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), filename + ".xlsx");
}


