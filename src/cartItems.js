import React, { useEffect } from 'react'

const CartItems = ({setOrdered,props,ordernumber,setOrderList,setOrderNumber,ordered}) => {

  const handleorderclick = (prop) => {
    const orderName = prop.name;
    const orderId = prop.id;
    const orderImg = prop.img;
    const orderDescription = prop.description;

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
    const orderId = prop.id;

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

  function bodymain() {
    return (
      <div className='listitems'>
          {
          
              ordered ? 
              <div className='orderedcard'>
                <h2>Your package is heading your way—get excited!</h2>
                <button onClick={() => setOrdered(false)}>Show my orders</button>
              </div> 
              : 
              ordernumber !== 0 ? 
              props.map((data,index) => (
                data.img && data.num !== 0 ? 
                <div className='container' key={index} >
                  <div className='imgandtitle'>
                    <img src={data.img}></img>
                    <div>
                      <h3>{data.name}</h3>
                      <div className='order'> {data.num} order</div>
                      <div className='plusandminus' style={{display: ordernumber === 0 ? 'none' : 'flex'}}>
                      <i className="bi bi-plus-circle-fill" onClick={() => handleorderclick(data)}></i>
                      <i className="bi bi-dash-circle-fill" onClick={() => handleUnorderclick(data)}></i>
                    </div>
                    </div>
                  </div>
                  <h5>Description : </h5>
                  <p style={{height:'auto'}}>{data.description}</p>
                </div>
                : ''
              ))
              : <h1>No meal is ordered</h1>
          }
      </div>
    )
  }
  
  useEffect(() => {
    bodymain();
  },[ordernumber])

  return bodymain();
}

export default CartItems
