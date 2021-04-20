import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cart from './Cart/Cart'
import CartIcon from './Svg/CartIcon'
import Location from './Svg/Location'
import SearchIcon from './Svg/SearchIcon'
import Hamburger from './Svg/Hamburger'
import { useSelector, useDispatch } from 'react-redux';
import SignupContainer from "./Form/SignupContainer";
import { auth,getUserDetails } from '../firebase/config'
import { userLoggedState,LogInUser,LogOutUser } from "../redux/userSlice";
import ProfileNavLink from './Profile/ProfileNavLink'
import Profile from "./Profile/Profile";
import { openSliderComponentState,openSliderComponent } from "../redux/sliderSlice";
import SliderContainer from "./SliderContainer";
import Order from './Orders/Order'
import { getClient } from "../utils/sanity";
import { addItem } from "./Cart/cartSlice";

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  
  const handleMenu = () => setMenuOpen(!menuOpen);
  const dispatch = useDispatch()
  const router = useRouter();
  const sliderState = useSelector(openSliderComponentState)

    const [signUp,setSignUp] = useState(false)
    const [logIn,setLogIn] = useState(false)
    const userAuthState = useSelector(userLoggedState)
 
    const openorClosePopUp = () => {
    setSignUp(!signUp)
  };

  const signInUser= () => {
    setLogIn(true)
  }
  const signUpUser=()=>{
    setLogIn(false)
  } 
  const signInOrUp = logIn? 'Sign in' : 'Sign up'
  const logOut = () => {
    dispatch(cancel())
    auth.signOut()
  }
   async function onAuthStateChange() {
     return  auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(LogInUser(user.displayName))
        const userDetails = await getUserDetails(auth.currentUser.uid)
        const {products} = userDetails
        const query = `*[_type == "product" && _id in 
        [
          ${products
            .map(i=>`'${i}'`)
            .join(',')
          }
          ]
        ]
        `
        const cartData = []
        await getClient().fetch(query).then(product=> {
          product.forEach((pro) => {
            cartData.push(pro)
          })
        })
        //console.log(cartData)
        dispatch(addItem(cartData[0]))
      }
       else {
        dispatch(LogOutUser())
      }
    });
  } 
  useEffect(() => {
    const unsubscribe =onAuthStateChange();
    return () => {
      unsubscribe();
    };
  }, []);
  

  return (
    <div className="bg-white">
      <header>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden w-full text-gray-600 md:flex md:items-center">
              <Location />
              <span className="mx-1 text-sm">BLR</span>
            </div>
            <div className="w-full text-gray-700 md:text-center text-2xl font-semibold">
              Evolution
            </div>
            <div className="flex items-center justify-end w-full">
              <div className='px-4'>
                {userAuthState.logIn ? <ProfileNavLink /> : 'logged Out '}
              </div>
              {!userAuthState.logIn &&
              <button onClick={openorClosePopUp}>
                Sign Up
              </button>
              }
              <button
                onClick={()=> dispatch(openSliderComponent('cart'))}
                className="text-gray-600 text-xs focus:outline-none px-4"
              >
                <CartIcon />
                Cart
              </button>

              <div className="flex sm:hidden">
                <button
                  onClick={handleMenu}
                  type="button"
                  aria-label="toggle menu"
                  className="text-gray-600 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                >
                <Hamburger />
                </button>
              </div>
            </div>
          </div>
          <nav
            className={`${
              menuOpen ? "" : "hidden"
            } sm:flex sm:justify-center sm:items-center mt-4`}
          >
            <ul className="flex flex-col sm:flex-row">
              <Link href="/">
                <a className={router.pathname == "/" ? "mt-3 text-blue-500 hover:underline sm:mx-3 sm:mt-0" : "mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"} >
                  Home
                </a>
              </Link>
              <Link href="/products">
                <a className={router.pathname.startsWith("/products") ? "mt-3 text-blue-500 hover:underline sm:mx-3 sm:mt-0" : "mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"}>
                  Shop
                </a>
              </Link>
              <Link href="/categories">
                <a className={router.pathname.startsWith("/categories") ? "mt-3 text-blue-500 hover:underline sm:mx-3 sm:mt-0" : "mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"}>
                  Categories
                </a>
              </Link>
              <Link href="/about">
                <a className={router.pathname == "/[slug]" ? "mt-3 text-blue-500 hover:underline sm:mx-3 sm:mt-0" : "mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"}>
                  About
                </a>
              </Link>
            </ul>
          </nav>
          <div className="relative mt-6 max-w-lg mx-auto">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <SearchIcon />
            </span>

            <input
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
      </header>
      
      <SliderContainer>
        {sliderState === 'cart' && <Cart />}
        {sliderState === 'profile' && <Profile Logout={logOut}/>} 
        {sliderState === 'order' && <Order />}         
      </SliderContainer>
     
      <main className="my-8">{children}</main>
      {(signUp || logIn) && 
        <SignupContainer 
        SignInOrUp={signInOrUp}
        Close={openorClosePopUp}
        SignInUser={signInUser}
        SignUpUser={signUpUser}
        />
      }
      
      <footer className="bg-gray-200">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a
            href="#"
            className="text-xl font-bold text-gray-500 hover:text-gray-400"
          >
            Evolution.
          </a>
          <p className="py-2 text-gray-500 sm:py-0">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}


export default Layout;
