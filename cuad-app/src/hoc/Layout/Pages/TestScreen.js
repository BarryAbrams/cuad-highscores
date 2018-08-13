import React, {Component} from 'react';

class TestScreen extends Component {
    render() {  
        const tableRow =  (
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        );

        return (
            <div className="testscreen">
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    {tableRow}
                    </tbody>       
                </table>
            </div>
        )
    }    
}

export default TestScreen;