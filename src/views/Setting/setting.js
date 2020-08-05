import React from 'react'
import Papa from "papaparse";
import ItemDataService from '../../Services/item.service'

export default class Setting extends React.Component{

    constructor(){
        super();
        this.state={
            csvfile: undefined
        }
    }
    handleChange = (event) => {
        this.setState({
          csvfile: event.target.files[0],
        });
      };
      importCSVGroup = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
          complete: this.updateDataGroup,
          header: true,
          skipEmptyLines: true,
        });
      };
      importCSVItem = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
          complete: this.updateDataItem,
          header: true,
          skipEmptyLines: true,
        });
      };
      updateDataGroup(result) {
        var data = result.data;
        data.map((singleGroup) =>
          ItemDataService.createGroup(singleGroup)
            .then((response) => {})
            .catch((e) => {
              console.log(e);
            })
        );
      }
      updateDataItem(result) {
        var data = result.data;
        data.map((singleItem) =>
          ItemDataService.create(singleItem)
            .then((response) => {})
            .catch((e) => {
              console.log(e);
            })
        );
      }

    render(){
        return(
            <div> 
            <input type="file" className="btn-upload-file" ref={(input) => {this.filesInput = input;}} name="file" placeholder={null} onChange={this.handleChange} />    
            <button type="submit" className="btn btn-success" onClick={this.importCSVGroup} style={{ float: "right", margin: "8px" }}>Group Bulk Import</button>
            <button type="submit" className="btn btn-success" onClick={this.importCSVItem} style={{ float: "right", margin: "8px" }}>Item Bulk Import</button>
            </div>
        )
    }
}