class csvExport {
    constructor(table, header = true) {
        this.table = table;
        this.rows = Array.from(table.querySelectorAll("tr"));
        if(!header && this.rows[0].querySelectorAll("th").length){
            this.rows.shift();
        }
        console.log(this.rows);
        console.group(this._longestRow());
    }

    exportCsv(){
        const lines = [];
        const ncols = this._longestRow(); 
        for(const row of this.rows) {
            // console.log(row);
            let line = "";
            for(let i = 0; i < ncols; i++) {
                if(row.children[i] !== undefined) {
                    line += csvExport.safeData(row.children[i]);
                }
                line += i !== ncols - 1 ? "," : "";
            }
            lines.push(line);
        } 
        console.log(lines);
        return lines.join("\n");
    }

    _longestRow(){
        return this.rows.reduce((length, row) =>(
            row.childElementCount > length? row.childElementCount :
            length),0);
    }
    static safeData(td){
        let data = td.textContent;
        //Replace all double quote to two double qoutes
        data = data.replace(/"/g, '""');

        // replace , amd \n to double quotes
        data=/[",\n"]/.test(data)?`"${data}"` : data;
        
        return data;
    }
}

const btnExport = document.querySelector('#btnExport');
const tableElement = document.querySelector('#table')

btnExport.addEventListener('click', () => {
    const obj =  new csvExport(tableElement,false)
    const csvData = obj.exportCsv();
    const blob = new Blob([csvData], {type : "text/csv"});
    const url =URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "file.csv";
    a.click();

    setTimePit(() =>{
        URL.revokeObjectURL(url);
    }, 500); 
    // obj.exportCsv();
});
