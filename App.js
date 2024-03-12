import React, { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useState } from 'react';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {debounce} from 'lodash';
import { fetchLocations, fetchWeatherForecast } from './api/weather';
import { weatherImages } from './consts';

export default function App(){
  const [showSearch, toggleSearch]=useState('false');
  const [locations, setLocations]=useState([]);
  const [weather, setWeather]=useState({})

  const handleLocation=(loc)=>{
    console.log('Location: ',loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days:'7'
    }).then(data=>{
      setWeather(data);
      console.log('got data: ',data);
    })
  }

  const handleSearch =value=>{
    if(value.length>2){
      fetchLocations({cityName: value}).then(data=>{
        setLocations(data);
      })
    }
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

  const {current , location}=weather;

  return(
    <View>
      <View style={{width:'100%', height:'100%', backgroundColor:'#000'}}>
        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          {
            showSearch?(
              <TextInput
              onChangeText={handleTextDebounce}
              style={{backgroundColor:'#fff',borderRadius:60,flex:1, padding:16, marginLeft:25, marginTop:23, marginBottom:15, fontSize:18}} placeholder='    Search'></TextInput>
            ):null
          }
          <TouchableOpacity 
          onPress={()=>toggleSearch(!showSearch)}
          style={{ backgroundColor:'#fff', width:55, height:56, justifyContent:'center', marginTop:24, alignItems:'center',marginVertical:12, marginHorizontal:5, borderRadius:30, marginRight:20, marginLeft:10}}>
            <Image source={require('./assets/Images/image6.png')} style={{width:20,height:20}}></Image>
          </TouchableOpacity>
          
        </View>
        <View style={{alignItems:'center'}}>
          <ImageBackground
          style={{width:'96%',height:550, marginLeft:15, justifyContent:'center', alignItems:'center', marginTop:7}}
          imageStyle={{borderRadius: 40}}
          source={require('./assets/Images/bg.png')}
          resizeMode='cover'>
          <Text style={{color:'#fff', fontWeight:'700', marginVertical:40, fontSize:23}}>{location?.name},  
          <Text style={{color:'#B8B6B6', fontWeight:'600', fontSize:20}}>  {" "+location?.country}</Text>
          </Text>
          <View style={{alignItems:'center', marginTop:10}}>
            <Image source={{uri:'https:'+current?.condition?.icon}}
            //<Image source={require('./assets/Images/image2.png')}
            style={{width:170, height:170}}/>
          </View>
          <Text style={{color:'#fff',  fontWeight:'bold', fontSize:45, marginTop:10, marginVertical:10}}> {current?.temp_c}&#176;</Text>
          <Text style={{color:'#B8B6B6', fontSize:18, marginVertical:15}}>{current?.condition?.text}</Text>
          <View style={{flexDirection:'row', marginVertical:40}}>
            <Image source={require('./assets/Images/image3.png')} style={{width:25, height:25}}></Image>
            <Text style={{color:'#B8B6B6', fontSize:20, fontWeight:'700'}}>  {current?.wind_kph}Km</Text>
            <Image source={require('./assets/Images/image4.png')} style={{width:24, height:24, marginLeft:25}}></Image>
            <Text style={{color:'#B8B6B6', fontSize:20, fontWeight:'700'}}>   {current?.humidity}%</Text>
            <Image source={require('./assets/Images/image5.png')} style={{width:24, height:24, marginLeft:25}}></Image>
            <Text style={{color:'#B8B6B6', fontSize:20, fontWeight:'700'}}>  {weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
          </View>
          </ImageBackground>
        </View>
        {
          locations.length>0 && showSearch?(
          <View style={{position:'absolute', backgroundColor:'#fff', marginTop:85, borderRadius:28, width:'93%', paddingHorizontal:20, paddingVertical:15, marginHorizontal:13}}>
            <View>
            {
              locations.map((loc,index)=>{
                let showBorder=index+1!=locations.length;
                let borderClass=showBorder? showBorder:'#000';
                return(
                  <TouchableOpacity
                  onPress={()=>handleLocation(loc)}
                    key={index}
                    style={{flexDirection:'row', paddingHorizontal:10, marginVertical:10, alignItems:'center', paddingVertical:5, alignItems:'center'+borderClass}}
                    >
                    <Text style={{fontWeight:'600', fontSize:15}}>{loc?.name},{loc?.country}</Text>
                  </TouchableOpacity>
                );
              })
            }
            </View>
          </View>
          ):null
          }
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal:8, marginTop:7}}
          showsHorizontalScrollIndicator={false}
        >
          {
            weather?.forecast?.forecastday?.map((item, index)=>{
              let date=new Date(item.date);
              let options={weekday:'long'};
              let dayName=date.toLocaleDateString('en-US',options);
              dayName=dayName.split(',')[0]
              return(
                <View>
                <ImageBackground style={{justifyContent:'flex-start', borderRadius:20, width:180, height:200, marginTop:15, alignItems:'center', marginHorizontal:8}}
                imageStyle={{borderRadius: 40}}
                source={require('./assets/Images/img.jpg')}
                resizeMode='cover'
                >
            <Image source={{uri:'https:'+item?.day?.condition?.icon}}
            style={{width:50, height:50, padding:20, marginTop:30, margin:8}}/>
            <Text style={{color:'#fff', marginBottom:10, fontSize:18}}>{dayName}</Text>
            <Text style={{color:'#fff',  fontWeight:'bold', fontSize:25}}> {item?.day?.avgtemp_c}&#176;</Text>
              </ImageBackground>
              </View>
              )
            })
          }
         
        </ScrollView>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
});