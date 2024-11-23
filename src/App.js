import { useEffect, useState } from 'react';
import './App.css';
import CartItems from './cartItems';

function App() {
  const [maindata,setMainData] = useState(null);
  const [searchmeal,setSearchMeal] = useState('');
  const [hovercon,setHoverCon] = useState();
  const [ordernumber,setOrderNumber] = useState(0);
  const [orderlist,setOrderList] = useState([]);
  const [openCartItems,setOpenCartItems] = useState(false);
  const [ordered,setOrdered] = useState(false);

  function ordercount(prop) {

    const orderIds = prop.idCategory || prop.idMeal;
    const orderget = orderlist.find((order) => 
      order.id === orderIds
    );

    return orderget ?  orderget.num : 0
  }

  const handlesearch = () => {
    if (searchmeal.trim()) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchmeal}`)
        .then(response => response.json())
        .then(data => setMainData(data.meals))
        .catch(err => console.error('Error by fetching data :', err));
    };
  };

  const handleorderclick = (prop) => {
    const orderName = prop.strCategory || prop.strMeal;
    const orderId = prop.idCategory || prop.idMeal;
    const orderImg = prop.strCategoryThumb || prop.strMealThumb;
    const orderDescription = prop.strCategoryDescription || prop.strInstructions

    setOrderList(prelist => {
      const existingOrder = prelist.find(order => order.id === orderId);
      if (existingOrder) {
        return prelist.map(order => 
          order.id === orderId ? {...order,num: order.num + 1} : order
        );
      } else {
        return [...prelist,{name:orderName ,id: orderId, num:1,img:orderImg,description:orderDescription}];
      }
    });
    setOrderNumber(pre => pre + 1);
  };

  const handleUnorderclick = (prop) => {
    const orderId = prop.idCategory || prop.idMeal;

    setOrderList(prelist => {
      const existingOrder = prelist.find(order => order.id === orderId);
      if (existingOrder) {
        return prelist.map(order => 
          order.id === orderId ? {...order,num: order.num - 1} : order
        );
      }
    });
    setOrderNumber(pre => pre - 1);
  };

  const refreshthecart = () => {
    setOrderNumber(0);
    setOrderList(org => {
      return org.map((pre => pre.num === 0))
    })
  };

  const backtohome = () => {
    setSearchMeal('');
    setOpenCartItems(false)
  };

  const buybtn = () => {
    setOrdered(true);
    setOpenCartItems(true);
  };
  

  useEffect(() => {
    localStorage.setItem('orderlist', JSON.stringify(orderlist));
  },[orderlist])

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchmeal}`)
      .then(response => response.json())
      .then(data => setMainData(data.meals))
      .catch(err => console.error('Error by fetching data :', err));
  },[searchmeal]); 

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(response => response.json())
      .then(data => setMainData(data.categories))
      .catch(err => console.error('Error by fetching data :', err));
  },[]);

  return (
    <div className="App">
      <div className='header'>
      <i className="bi bi-house" onClick={backtohome}></i>
        <div className="ui-input-container">
          <input
            required=""
            placeholder="Search Meal..."
            className="ui-input"
            type="text"
            value={searchmeal}
            onChange={e => setSearchMeal(e.target.value)}
          />
          <div className="ui-input-underline"></div>
          <div className="ui-input-highlight"></div>
          <div className="ui-input-icon" onClick={handlesearch}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="currentColor"
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              ></path>
            </svg>
          </div>
        </div>
        <div className='cartsbuttons' onClick={() => setOpenCartItems(true)}>
          <i className="bi bi-cart">
            <span className='ordernumber' 
            style={{display: ordernumber === 0 ? 'none' : 'inline'}}
            >{ordernumber}</span>
          </i>
          <i className="bi bi-arrow-clockwise reloadcart"
          style={{display: ordernumber === 0 ? 'none' : 'inline'}}
          onClick={() => refreshthecart()}
          ></i>
        </div>
        <button className="Btn" onClick={buybtn} 
        style={{display: ordernumber === 0 ? 'none' : 'flex'}}
        >
          Shop
          <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
        </button>

      </div>
      {
        openCartItems ? <CartItems setOrdered={setOrdered} props={orderlist} ordernumber={ordernumber} setOrderList={setOrderList} setOrderNumber={setOrderNumber} ordered={ordered}/> :
        <div className='listitems'>
          {
            maindata ?
            (maindata.map((data,index) => (
              <div className='container' key={index} >
                <div className='orderlist' style={{display : ordercount(data) === 0 || ordernumber === 0 ? 'none' : 'flex'}}>
                  {ordercount(data)}
                </div>
                <div className='imgandtitle'>
                  <img src={data.strCategoryThumb || data.strMealThumb}></img>
                  <div>
                    <h3>{data.strCategory}</h3>
                    <button className='order'
                    onClick={() => handleorderclick(data)}
                    >Order</button>
                    <div className='plusandminus' style={{display: ordernumber === 0 ? 'none' : 'flex'}}>
                      <i className="bi bi-plus-circle-fill" onClick={() => handleorderclick(data)}></i>
                      <i className="bi bi-dash-circle-fill" onClick={() => handleUnorderclick(data)}></i>
                    </div>
                  </div>
                </div>
                <h5>Description : </h5>
                <p style={{height: hovercon === index ? 'auto' : '100px'}}>{data.strCategoryDescription || data.strInstructions}</p>
                <button
                className='showmore'
                onClick={() => {
                  hovercon === index ? setHoverCon()
                  : setHoverCon(index)
                }} 
                >{hovercon === index ? 'Show less' : 'Show more'}</button>
              </div>
            ))
            )
            : <p>Oops! No meals available right now.</p>
          }
        </div>
      }
      
    </div>
  );
}

export default App;