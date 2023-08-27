import styled from "styled-components";

const CustomerWrapper = styled.div`
  .container{
    min-height: 1080px;
    max-width: 900px !important;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    padding-top: 20px!important;
    padding-left: 12px!important;
    padding-right: 12px!important;
  }
  .wrap-btnfooter {
    max-width: 6.25rem;
  }
  .wrapper-box {
    padding-bottom: 5rem!important;
  }
  .sm-containter {
    min-height: auto;
  }
  .mx-wbtn {
    width: 6.25rem!important;
  }
  .txt {
    font-size: 12px;
  }
  .pos-top{
    top: 50px;
    box-shadow: 0 2px 4px -4px black;
    background: white;
    z-index: 2;
  }
  .pos-r{
    top: 200px;
    position: relative;
    z-index: 1;
  }
  .t-stick{
    position: sticky; top: 0;
    border-top: white;
    overflow: hidden;
  }
  .table{
    border-bottom: solid black 2px;
    overflow: hidden;
  }
  .box{
    border: solid black 2px;
  }
  th{
    background: #23354D;
  }
  .wrap-text {
    font-size: 12px;
    row-gap: 3px;
    page-break-inside:avoid; page-break-after:auto
 
  }
  .t-left{
    margin-left: 1px;
  }
  .inp-box {
    max-width: 90px;
  }
  .heading-container {
    max-width: 900px;
    margin: 0 auto;
  }
  .MuiAutocomplete-root {
    max-width: 300px;
    width: 100%;
    background-color: #fff;
  }
  .customer-box-sl {
    column-gap: 0px;
  }
  .cs-add-btn {
    border: 1px solid #302e38;
    background-color: transparent;
    color: #302e38!important;
    border-radius: 6px!important;
    font-size: 12px;
    line-height: 22px!important;
  }
  .cs-add-btn.confirm {
    background-color: #302e38;
    color: #fff!important;
    box-shadow: none;
  }
  table.qa-table {
    margin-bottom: 20px;
    min-height: 480px;
  }
  table.qa-table tbody {
    vertical-align: inherit;
  }
  table.qa-table tbody tr {
    height: 33px;
  }
  table tbody.min-h {
    min-height: 33px;
    height: 100%;
  }
  table thead tr th {
    background-color: #d7d7d7;
    color: #000!important;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    border: 1px solid #000;
    vertical-align: middle!important;
    
  }
  table.qa-table tr td {
    border: 1px solid #000;
    border-top: none;
    border-bottom: none;
  } 
  table.qa-table tbody tr th {
    background-color: #fff;
    border: 1px solid #000;
    border-top: none;
    border-bottom: none;
  }
  table.common-table tbody tr td {
    border: 1px solid #000;
  }
  table tr.hs-border {
    border: 1px solid #000;
    height: 23px;
  }
  table tbody.min-h tr th {
    height: 33px;
  }
  .w-desc {
    width: 250px;
  }
  .w-price {
    width: 75px;
  }
  .w-45 {
    width: 45px;
  }
  .w-1 {
    width: 100px;
  }
  .w-12 {
    width: 120px;
  }
  .ta-r {
    text-align: right;
  }
  .ta-c {
    text-align: right;
  }
  .wrap-input {
    gap: 5px;
  }
  .sign-namebox {
    max-width: 350px;
    margin-left: auto!important;
    margin-right: 0;
    margin-bottom: 10px;
    padding-top: -20px;
  }
  .line {
    height: 16px;
    width: 200px;
    border-bottom: 1px solid #000;
    margin-bottom: 15px;
  }
  .txt-sty {
    text-align: center;
  }
  .txt-hd {
    font-size: 12px!important;
    min-width: 55px;
    margin-right: 10px;
  }
  table tbody tr td.tb-click {
    cursor: pointer;
  }
  .MuiInputBase-input.MuiInput-input.Mui-disabled {
    -webkit-text-fill-color: unset;
  }
  .mx-900 {
    max-width: 900px;
    margin: 0 auto;
  }
  .wrap-textfield .MuiInputBase-root.MuiInput-root.Mui-disabled::before {
    border-bottom-style: none!important;
    border-bottom: transparent!important;
  }
  table .dlt-icon {
    cursor: pointer;
  }
  .MuiFormLabel-root.MuiInputLabel-root {
    line-height: 1!important;
  }
  .no-click{
    pointer-events: none;
  }
  .btn-save {
    background-color: #302e38;
  }

  .footer{
    background-color: rgb(255,255,255);
    // backdrop-filter: blur(10px);
    position: fixed;
    width: 95%;
    bottom: 0;
    color: white;
    font-size: 25px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 6px;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  }
  .footer .wrap-box {
    width: 100%;
  }
  @media print {
    a[href]:after { content: none !important; }
    #no-print {
      display: none;
    }
    .no-print {
      display: none;
    }
    .container {
      padding-top: 0!important;
    }
    .wrap-textfield .MuiInputBase-root.MuiInput-root::before {
      border-bottom-style: none!important;
      border-bottom: transparent!important;
    }
    .wrap-textfield .MuiInputBase-root.MuiInput-root{
      line-height: 12px;
      height: 18px;
    }
    table .dlt-icon {
      display:none!important;
    }
    resize:{
      fontSize:11px;
    }
  }
`
export default CustomerWrapper