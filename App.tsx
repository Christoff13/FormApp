import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {

  let isLoggedIn = false;
  let isIEDCollab = false;

  const Stack = createNativeStackNavigator();

  /*
  *  HomeScreen is the authentication view containing the log in formValid
  */
  const HomeScreen = ({ navigation }) => {

    const [email, setEmail] = useState({ value: "", isValid: false });
    const [password, setPassword] = useState({ value: "", isValid: false });
    const [formValid, setFormValid] = useState(false);

    /*
    *   checks that the email is of the right format and update email state
    */
    function checkEmail(input) {
      let regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      setEmail({ isValid: regMail.test(input), value: input });
    }

    /*
    *   Called after each email update to render components accordingly
    */
    useEffect(() => {

      // if email is the right format and also contains inextenso.fr
      // then it's an Inextenso collaborator
      if (email.isValid && email.value.includes("inextenso.fr")) {
        isIEDCollab = true;
      }

      // If email and password are valid format then rerender login button
      setFormValid(email.isValid && password.isValid);
    }, [email]);


    /*
    *   checks that the password is of the right format and update password state
    */
    function checkPassword(input) {
      let regPwd = /^(?=.*[@$!%*?&])(?=.*[a-zA-Z]).{6,}$/gm;
      setPassword({ isValid: regPwd.test(input), value: input });
    }

    /*
    *   Called after each password update to render components accordingly
    */
    useEffect(() => {
      // If email and password are valid format then rerender login button
      setFormValid(email.isValid && password.isValid);
    }, [password]);

    /*
    *   If user not already logged in and form is valid then display profile page
    */
    function submitForm() {
      if (!isLoggedIn && formValid) {
        navigation.navigate('Profile');

        // reset navigation to prevent going back to HomeScreen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Profile' }],
        });
        isLoggedIn = true;
      }
    }

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("./assets/log2.png")} />

        <View style={email.isValid ? styles.inputView : styles.inputViewRed}>
          <IEDFormInput
            type={"email"}
            onChangeText={(email) => checkEmail(email)}
          />
        </View>

        <View style={password.isValid ? styles.inputView : styles.inputViewRed}>
          <IEDFormInput
            type={"password"}
            onChangeText={(password) => checkPassword(password)}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>

        <IEDFormButton onPress={() => submitForm()}
          style={formValid ? styles.loginBtn : styles.loginBtnDisabled}
          text={"LOGIN"}
        />
      </View>

    );
  };

  /*
  *  ProfileScreen is shown right after user logs in
  */
  const ProfileScreen = ({ navigation, route }) => {

    function logOut() {

      isLoggedIn = false;
      isIEDCollab = false;
      navigation.navigate('Authentication');

    }

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("./assets/log2.png")} />
        <Text>HELLO {isIEDCollab ? "DEAR COLLABORATOR" : ""}</Text>
        <IEDFormButton onPress={() => logOut()}
          style={styles.loginBtn}
          text={"LOGOUT"}
        />
      </View>
    );
  };

  /*
  *  Main navigation stack
  *  contains: HomeScreen, ProfileScreen
  */
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Authentication"
          component={HomeScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
*   IEDFormInput component
*/
function IEDFormInput(props) {

  return (
    props.type == 'email' ?
      <TextInput
        placeholder="Email."
        placeholderTextColor="#003f5c"
        onChangeText={props.onChangeText}
      />
      :
      <TextInput
        placeholder="Password."
        placeholderTextColor="#003f5c"
        secureTextEntry={true}
        onChangeText={props.onChangeText}
      />
  );
}

/*
*   IEDFormButton component
*/
function IEDFormButton(props) {

  return (
    <TouchableOpacity style={props.style} onPress={props.onPress}>
      <Text>{props.text}</Text>
    </TouchableOpacity>
  );
}

/*
*   StyleSheet
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
    width: 100,
    height: 100
  },

  inputViewRed: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  inputView: {
    backgroundColor: "#EEEEEE",
    borderColor: "#000000",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },

  loginBtnDisabled: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#aaaaaa",
  }
});