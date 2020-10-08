import React, {Component} from 'react';
import classes from './Burger.css';
import BurgerIngredient from './Burgeringredients/Burgeringredient';

const burger = (props) =>{
    let transformedIngrediets = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_,i)=>{
                return <BurgerIngredient key={igKey+i} type={igKey} />;
            })
        })
        .reduce((arr,el)=>{ 
            return arr.concat(el);
        },[]);
        //without reduce function, transformedIngrediets will be an array of 4 elements. 
        //But with reduce function, transformedIngrediets will display only 
        //number of added elements(ingredients)

    if(transformedIngrediets.length === 0){
        transformedIngrediets = <p>Please add ingredients!</p>
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>   
            {transformedIngrediets}     
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );

}

export default burger;