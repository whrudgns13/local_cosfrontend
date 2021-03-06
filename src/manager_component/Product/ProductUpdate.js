import React, { useState, useEffect, useRef } from 'react';
import AxiosApiService from '../../AxiosApiService';
import '../managerCss/productDetail.css';
import '../managerCss/productUpdate.css';
import { useHistory } from "react-router-dom";
import Sidebar from './component/Sidebar';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateComponent from './component/UpdateComponent';

function ProductUpdate({productListOpen,productDelete,saveImg}) {
    let history = useHistory();
    const [products, setProducts] = useState([0]);
    const imgUrl = "/imgs/";
    const imageInput = useRef();
    const [productImg, setProductImg] = useState({ img: [0] });
    const [product_img, setProduct_img] = useState([]);

    useEffect(() => {
       getProductDetail();
    }, [])

    function onTitle(e) {
        let title = products;
        title.map(product => {
            product.product_title = e.currentTarget.value;
        })
        setProducts(title);
    }
    function selectGender(e) {
        let gender = products;
        gender.map(product => {
            product.product_gender = e.currentTarget.value;
        })
        setProducts(gender);
    }
    function selectCategory(e) {
        let category = products;
        category.map(product => {
            product.product_category = e.currentTarget.value;
        })
        setProducts(category);
    }
    function onPrice(e) {
        let price = products;
        price.map(product => {
            product.product_price = parseInt(e.currentTarget.value);
        })
        setProducts(price);
    }
    const onContent = (e) => {
        let content = products;
        content.map(product => {
            product.product_content = e.currentTarget.value;
        })
        setProducts(content);
    }
    const onMaterial = (e) => {
        let material = products;
        material.map(product => {
            product.product_material = e.currentTarget.value;
        })
        setProducts(material);
    }
    const onSize = (e, index) => {
        let size = products;
        size[index].product_size = e.currentTarget.value;
        setProducts(size);
    }
    const onColor = (e, index) => {
        let color = products;
        color[index].product_color = e.currentTarget.value;
        setProducts(color);
    }
    const onStock = (e, index) => {
        let stock = products;
        stock[index].product_stock = parseInt(e.currentTarget.value);
        setProducts(stock);
    }

    //????????? ?????? ?????? ?????? ?????? ???????????? ?????? db?????? ?????????
    function getProductDetail() {
        AxiosApiService.getProductDetail(window.localStorage.getItem("product_seq"))
            .then(res => {
                let productList = res.data;
                //,???????????? ????????? ??????
                setProductImg({ img: res.data[0].product_img.split(",") });
                setProducts(productList);
                console.log(products);
            })
            .catch(err => {
                history.push('/managerDefaultErr');
                console.log('getProductDetail() Error!', err);
            })
    }
    //?????? ????????????
    const productUpdate = () => {
        saveImg(product_img);
        AxiosApiService.productUpdate(products)
            .then(() => {
                productListOpen();
                window.localStorage.removeItem('product_seq');
            })
            .catch(err => {
                history.push('/managerDefaultErr');
                console.log('Update() Error!', err);
            })
    }
    
    const fileClick = () => {
        imageInput.current.click();
    }

    //???????????????
    function onImg(e) {
        let prodimg = productImg;
        //?????? ????????? ????????? ?????????
        if (e.target.files.length > 0) {
            const imageFile = e.target.files[0];
            //?????? ??????
            setProduct_img(product_img.concat(imageFile));
            //????????? ???????????? ????????? ??????
            prodimg = prodimg.img.concat(imageFile.name);
            //??????????????? ????????? ?????????
            setProductImg({ img: prodimg });
            //????????? ,??? ?????? ?????????
            let imgStr = prodimg.join(',');
            let productCopy = products;
            productCopy.map((product, index) =>
                //product[index].product_img??? ????????? ??????
                productCopy[index].product_img = imgStr
            )
            setProducts(productCopy);
        }
    }

    const ImgDelete = (e,imgs) => {
        //productImg??? ??????
        let prodimg = productImg;
        //prodimg??? ????????? ?????? ????????? ??????
        prodimg = prodimg.img.filter(img=> img !== imgs)
        console.log(prodimg);
        //productImg.img??? ??????
        setProductImg({ img: prodimg });
        //????????? ,??? ?????? ?????????
        let imgStr = prodimg.join(',');
        //??????
        let productCopy = products;
        productCopy.map((product, index) =>
            //product[index].product_img??? ????????? ??????
            productCopy[index].product_img = imgStr
        )
        setProducts(productCopy);
    }
    //????????????
    function tablePlus() {
        let insertproducts =[{  
            //product_seq:(products[products.length-1].product_seq)+1,
            product_id:products[0].product_id,
            product_title: products[0].product_title,
            product_gender: products[0].product_gender,
            product_category: products[0].product_category,
            product_price: products[0].product_price,
            product_content: products[0].product_content,
            product_img: products[0].product_img,
            product_material: products[0].product_material,
            product_size: 'XS',
            product_color: 'BLACK',
            product_stock: '0',
        }]
        //AxiosApiService.insertProduct(products);
        setProducts(products.concat(insertproducts))
    }
    //????????????
    const tableMinus = (seq) => {
        console.log(seq);
        if(products.length>1){
                console.log(products.product_seq);
                console.log(products.filter(product => product.product_seq !== seq));
                console.log(seq);
                setProducts(products.filter(product => product.product_seq !== seq));
        }else{
            alert('1??? ?????? ?????????????????????.');
        }
        
    }
    return (
        <>
        <button onClick={()=>console.log(products,productImg)}></button>
            <h1 style={{marginTop:'30px'}}>?????? ??????</h1>
            <div className="detail_wapper">
               <Sidebar productImg={productImg} />
                <div className="detail_img_box">
                    {productImg.img.map((imgs, index) =>
                        <>
                            <button className="priview_button" onClick={(e) => ImgDelete(e,imgs)}><CancelIcon /></button>
                            <img className="detail_img" src={imgUrl + productImg.img[index]} />
                        </>
                    )}
                </div>
                <div className="detail_category">
                <UpdateComponent
                products={products}
                onTitle={onTitle}
                onPrice={onPrice}
                onMaterial={onMaterial}
                selectGender={selectGender}
                selectCategory={selectCategory}
                tablePlus={tablePlus}
                tableMinus={tableMinus}
                onColor={onColor}
                onSize={onSize}
                onStock={onStock}
                onContent={onContent}
                />
                    <input ref={imageInput} style={{ display: 'none' }} multiple="multiple" name="product_img" type='file' onChange={onImg} />
                    <button className='optionPage' style={{ width: '89%' }} type="button" onClick={fileClick}>????????? ?????????</button>
                    <button className='optionPage' style={{ width: '89%', marginTop: '10px' }} onClick={productUpdate}>?????? ??????</button>
                    <button className='optionPage' style={{ width: '89%', marginTop: '10px' }} onClick={()=>productDelete(products[0].product_id)}>?????? ????????????</button>
                </div>
            </div>

        </>
    )
}

export default ProductUpdate
