import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSumary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../..//components/UI/Spinner/Spinner'

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.4, 
    cheese: 1.3, 
    meat: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0, 
            cheese: 0, 
            meat: 0
        }, 
        totalPrice: 4,
        purchaseable: false, //whether at least one ingredient is selected or not
        purchasing: false, //whether order button is clicked or not
        loading: false
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey];
            })
            .reduce((sum, el) => { // sum = sum + el
                  sum+el;
            },0);
        this.setState({purchaseable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice; 
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0){
            return; 
        }

        let updatedCount = oldCount - 1;       
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice; 
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
        
    }
 
    purchaseContinueHandler = () => {
        //alert('You continue!');
                
       const queryParams = [];
       for(let i in this.state.ingredients){
           queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
       }
       queryParams.push('price=' + this.state.totalPrice);
       const queryString = queryParams.join('&');

       this.props.history.push({
           pathname: '/checkout',
           search: '?' + queryString
       });        
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0; 
            //if <0, will return true. else will return false
        }

        let orderSumary = <OrderSumary ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice}/>   

        if(this.state.loading){
            orderSumary = <Spinner />
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSumary}
                </Modal>
                
                <Burger ingredients = {this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler} 
                    disabled = {disabledInfo}
                    price = {this.state.totalPrice}
                    purchaseable = {!this.state.purchaseable}
                    ordered ={this.purchaseHandler}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;