import styled from "styled-components";

const CustomerWrapper = styled.div`
  .container{
    min-height: 1080px;
    max-width: 900px !important;
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }
  .txt {
    font-size: 14px;
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
    font-size: 14px;
    row-gap: 6px;
  }
  .inp-box {
    max-width: 300px;
  }
  .cs-add-btn {
    max-width: 80px;

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
    column-gap: 10px;
  }
  .cs-add-btn {
    background-color: #302e38;
    color: #fff!important;
    border-radius: 6px!important;
  }
  table {
    border-radius: 10px;
    // border-collapse: collapse;
  }
  table tbody tr {
    border-color: transparent;
    border-style: unset;
  }
  table tr th {
    background-color: #302e38;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-right: 1px solid rgba(255,255,255, 0.5);
    vertical-align: middle!important;
  }
  table tr td {
    font-size: 14px;
    border-right: 1px solid #302e38;
  }
  table tr td:nth-last-child(1) {
    border-right: none!important;
  }
  table tr:nth-child(even) td {
    background-color: rgba(48,46,56, 0.1);
  }
  table tr td.ta-border {
    background-color: #fff;
    border-top:1px solid #302e38;
    height: 38px;
  }
  table tr.hs-border {
    border-color: #302e!important;
    border-top: 1px solid #302e38!important;
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
`
export default CustomerWrapper