import React, {useState,useEffect} from 'react';
import AxiosApiService from '../../AxiosApiService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import IconButton from "@material-ui/core/IconButton";
import {useHistory} from "react-router-dom";
import Input from '@material-ui/core/Input';

function ProductList({productDetailOpen}) {
    const[products,setProducts] = useState({product:[0]});
    const [product_title,setProduct_title] = useState('');
    const imgUrl = "/imgs/";
    const history = useHistory();
    

    useEffect(()=>{
        getProductList()
    },[])
    
    function onChangeSearch(e){
        setProduct_title(e.currentTarget.value);
        console.log(product_title);
    }
    const onKeyPress = (e)=>{
        if(e.key==="Enter"){
            search();
        }
    }

    function search(){
    AxiosApiService.seachProductList(product_title)
            .then( res => {
                const productCheck = {
                    chk:res.data
                }
                //productCheck.chk.length>0?setResult(false):setResult(true);  
                setProducts({
                    product : res.data
                })
                
            })
            .catch( err =>{
                console.log('search() 에러', err);
            });
    }

    function getProductList(){
        AxiosApiService.getProductList()
        .then( res => {
            setProducts({
                product : res.data
            })
            
        })
        .catch(err => {
            console.log('getProductList() Error!', err);
        })
        
    }

    function returnProductDetail(seq){
        window.localStorage.setItem("product_seq",seq);
        console.log(seq);
        productDetailOpen()
    }

    const imgStyle ={
        width: '100px',
        height: '100px',
        objectFit:'cover'
    };
    return (
        <>
        <div style={{width:'100%', display:'flex', alignItems:'center',justifyContent:'space-between'}}>
            <div></div>
            <h1>상품목록</h1>
            <div style={{height:'30px',width:'30%' ,display:'flex',justifyContent:'flex-end'}}>
            <Input type="text" placeholder="상품이름 검색" onChange={onChangeSearch} onKeyPress={onKeyPress}/>
            <IconButton className="menuButton" onClick={search}>
                <SearchOutlinedIcon/>
            </IconButton>
            </div>
            </div>
                <Table style={{marginTop:'30px'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell alingn="right">상품번호</TableCell>
                            <TableCell alingn="right">상품이미지</TableCell>
                            <TableCell alingn="right">상품제목</TableCell>
                            <TableCell alingn="right">상품성별</TableCell>
                            <TableCell alingn="right">상품가격</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.product.map(product =>
                            <TableRow style={{height:'20%'}}>
                                <TableCell component="th" scope="board"> {product.product_id} </TableCell>
                                <TableCell alingn="right"><img style={imgStyle} src={imgUrl+product.product_img}></img></TableCell>
                                <TableCell alingn="right"><button style={{border:'none', backgroundColor:'#FFFFFF'}} 
                                onClick={()=>{returnProductDetail(product.product_id)}}>{product.product_title}</button></TableCell>
                                <TableCell alingn="right">{product.product_gender}</TableCell>
                                <TableCell alingn="right">{product.product_price}</TableCell> 
                            </TableRow>
                           )}
                    </TableBody>
                </Table>
               
        </>
    )
}

export default ProductList
