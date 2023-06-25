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
    margin-bottom: 20px;
  }
  table thead tr th {
    background-color: #d7d7d7;
    color: #000!important;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid #000;
    border-top: 1px solid #000!important;
    vertical-align: middle!important;
  }
  table tr td {
    border: 1px solid #000;
    border-top: none;
    border-bottom: none;
  }
  table tbody tr th {
    background-color: #fff;
    border: 1px solid #000;
    border-top: none;
    border-bottom: none;
  }
  table tr.hs-border {
    border: 1px solid #000;
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
  .wrap-input {
    gap: 10px;
  }
  .sign-namebox {
    max-width: 400px;
    margin-left: auto!important;
    margin-right: 0;
    margin-bottom: 40px;
    padding-right: 150px;
  }
  .line {
    height: 16px;
    width: 300px;
    border-bottom: 1px solid #000;
    margin-bottom: 15px;
  }
  .txt-sty {
    text-align: center;
  }
  .txt-hd {
    font-size: 14px!important;
  }
`
export default CustomerWrapper