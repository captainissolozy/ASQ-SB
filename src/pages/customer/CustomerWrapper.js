import styled from "styled-components";

const CustomerWrapper = styled.div`
  .wrapper-box{
    border-radius: 12px;
    margin-bottom: 40px;
    overflow: hidden;
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

  thead{
    background: #23354D;
  }
  .box{
    border: solid black 2px;
  }
  table thead tr th {
    font-size: 16px;
  }
  table tbody tr td {
    font-size: 14px;
  }
  th{
    background: #302e38;
  }
  .container{
    min-height: 1080px;
    max-width: 900px !important;
    background: white;
  }
  form2 {
    overflow: scroll;
    max-width: 900px;
  }
  .wrap-input {
    gap: 16px;
  }
  .wrap-header {
    width: 100%;
  }
  .sty-addbtn {
    background-color: #302e38;
    color: #fff; 
  }
  .css-2rshpx-MuiButtonBase-root-MuiIconButton-root:hover {
    background-color: rgba(48, 46, 56, 0.8);
  }
  .heading-container {
    gap: 12px;
  }
`
export default CustomerWrapper