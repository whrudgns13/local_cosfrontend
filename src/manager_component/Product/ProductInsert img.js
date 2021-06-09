import React, {useState,useEffect} from 'react';
import '../managerCss/productinsert.css'
import AxiosApiService from '../../AxiosApiService';
import {useHistory} from "react-router-dom";

function ProductInsert({productInsertOptionOpen}) {
    const [product_title,setProduct_title]= useState('');           //제목
    const [product_gender,setProduct_gender]= useState('남자');         //상품성별
    const [product_category,setProduct_category]= useState('상의');     //상품카테고리
    const [product_price,setProduct_price]= useState(0);             //상품가격
    const [product_content,setProduct_content]= useState('');       //상품내용
    const [imgPriView, setImgPriView] = useState([]); 
    const [imgStr, setImgStr] = useState("");               
    const [product_img,setProduct_img]= useState([]);             //상품이미지
    const [product_material,setProduct_material]= useState();
    const history = useHistory();
    function onTitle(e){
        setProduct_title(e.currentTarget.value);
    }
    function selectGender(e){
        setProduct_gender(e.currentTarget.value);
    }
    function selectCategory(e){
        setProduct_category(e.currentTarget.value);
    }
   function onPrice(e){
        setProduct_price(e.currentTarget.value);
    }
    function onContent(e){
        setProduct_content(e.currentTarget.value);
    }
    function onMaterial(e){
        setProduct_material(e.currentTarget.value);
     }
    useEffect(()=>{
        console.log(imgStr);
    })
    function onImg(e){
        setProduct_img(product_img.concat([e.target.files]));
        product_img.map((img,index)=>{
            const imageFile = e.target.files[index];
            const imageUrl = URL.createObjectURL(imageFile);
            setImgPriView(imgPriView.concat(imageUrl)); //이미지 주소
        })
       // imgStr.indexOf(imageFile.name)?setImgStr(imgStr+imageFile.name+","):console.log("같은 이름 있음");
    }
    
    function saveImg(e){
        const formData = new FormData();
        for(let i =0; i<product_img.length;i++){
            formData.append("file",product_img[i]);
            console.log("file",product_img[i]);
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        AxiosApiService.uploadFile(formData,config);
    }
    
    function optionPage(e){
        e.preventDefault();
        saveImg();
        let product = {
            product_title : product_title,
            product_gender: product_gender,
            product_category: product_category,
            product_price: product_price,
            product_content: product_content,
            product_img:imgStr.slice(0,-1),
            product_material:product_material
        }
        window.localStorage.setItem('product',JSON.stringify(product));
        productInsertOptionOpen();
    }
    
    return (
        <>
            <h1>상품등록</h1>
             <div className="img-category">
                    <div className="priview_img_box">
                        <div className="priview_img" >
                                <img className="priview" src={imgPriView}/>
                        </div>
                        <div className="file_input">
                        <input multiple="multiple" name="product_img" type='file' onChange={onImg}/>
                        </div>
                    </div>
                    
                <div className="displaybox">
                    <div className="title_box">
                        <label className="titleLabel">상품 제목</label>
                        <input className="product_title" name="product_title"
                        type="text" placeholder="상품제목" onChange={onTitle}></input>
                    </div>
                    <div className="select-box">
                        <div className="select-box-div">
                            <label className="selectLabel">성별</label>
                            <select className="select_category" onChange={selectGender} defaultValue="남자">
                                <option value="남자">남자</option>
                                <option value="여자">여자</option>
                            </select>
                        </div>
                        <div className="select-box-div">
                            <label className="selectLabel">카테고리</label>
                            <select className="select_category" onChange={selectCategory} defaultValue="상의">
                                <option value="상의">상의</option>
                                <option value="하의">하의</option>
                                <option value="치마">치마</option>
                                <option value="악세사리">악세사리</option>
                                <option value="신발">신발</option>
                            </select>
                            </div>
                    </div>
            
                    <div className="product_price_stock">
                            <label className="selectLabel">상품 가격</label>
                            <input className="product_price" name="product_price"
                            type="text" placeholder="상품가격" onChange={onPrice}></input>
                    </div>
                    <div className="product_price_material">
                            <label className="selectLabel">상품 재질</label>
                            <input className="product_price" 
                            type="text" placeholder="상품가격" onChange={onMaterial}></input>
                    </div>
                    <div className="content_box">
                        <label className="selectLabel">상품설명</label>
                        <div className="content_box_scroll">
                        <textarea type="text" name="product_content" className="product_content" 
                        placeholder="상품설명" onChange={onContent}></textarea>
                        </div>
                    </div>
                    <button className='optionPage' type="button" onClick={optionPage}>옵션 설정</button>
                    <button onClick={()=>console.log(product_img,imgPriView)}>옵션 설정</button>
    
                
                </div>
            </div>
            
            
        </>
    )
    }
export default ProductInsert
