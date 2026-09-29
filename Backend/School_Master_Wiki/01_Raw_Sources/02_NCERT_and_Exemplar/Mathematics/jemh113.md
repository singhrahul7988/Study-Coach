---
source_file: jemh113.pdf
type: Official_Educational_Resource
---

# DOCUMENT: jemh113
*LLM INSTRUCTION: This is a verified raw source. Use this content to answer questions or generate study plans.*

171 

STATISTICS 

**==> picture [86 x 85] intentionally omitted <==**

## **STATISTICS** 

## **13** 

## **13.1 Introduction** 

In Class IX, you have studied the classification of given data into ungrouped as well as grouped frequency distributions. You have also learnt to represent the data pictorially in the form of various graphs such as bar graphs, histograms (including those of varying widths) and frequency polygons. In fact, you went a step further by studying certain numerical representatives of the ungrouped data, also called measures of central tendency, namely, _mean_ , _median_ and _mode_ . In this chapter, we shall extend the study of these three measures, i.e., mean, median and mode from ungrouped data to that of _grouped data_ . We shall also discuss the concept of cumulative frequency, the cumulative frequency distribution and how to draw cumulative frequency curves, called _ogives_ . 

## **13.2 Mean of Grouped Data** 

The mean (or average) of observations, as we know, is the sum of the values of all the observations divided by the total number of observations. From Class IX, recall that if _x_ 1 _, x_ 2 _,. . ., x_ n are observations with respective frequencies _f_ 1 _, f_ 2 _, . . ., f_ n, then this means observation _x_ 1 occurs _f_ 1 times, _x_ 2 occurs _f_ 2 times, and so on. 

Now, the sum of the values of all the observations = _f_ 1 _x_ 1 + _f_ 2 _x_ 2 + . . . + _fnxn_ ,  and the number of observations = _f_ 1 + _f_ 2 + . . . + _fn_ . 

So, the mean ~~_x_~~ of the data is given by 

**==> picture [128 x 28] intentionally omitted <==**

Recall that we can write this in short form by using the Greek letter  (capital sigma) which means summation. That is, 

Reprint 2026-27 

172 

MATHEMATICS 

**==> picture [373 x 90] intentionally omitted <==**

**----- Start of picture text -----**<br>
n<br> fi xi<br>i  1<br>x  = n<br> fi<br>i  1<br> fi xi<br>which, more briefly, is written as  x  =  , if it is understood that  i  varies from<br> fi<br>1 to  n .<br>**----- End of picture text -----**<br>


Let us apply this formula to find the mean in the following example. 

**Example 1 :** The marks obtained by 30 students of Class X of a certain school in a Mathematics paper consisting of 100 marks are presented in table below. Find the mean of the marks obtained by the students. 

|**Marks obtained**<br>**(****_xi_**)|10|20|36|40|50|56|60|70|72|80|88|92|95|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|**Number of**<br>**students (****_fi_**)|1|1|3|4|3|2|4|4|1|1|2|3|1|



**Solution:** Recall that to find the mean marks, we require the product of each _xi_ with the corresponding frequency _fi_ . So, let us put them in a column as shown in Table 13.1. 

**Table 13.1** 

|**Marks obtained** **(****_xi_)**|**Number of students** **(****_fi_)**|**_fixi_**|
|---|---|---|
|10<br>20<br>.<br>36<br>40<br>50<br>56<br>60<br>70<br>72<br>80<br>88|1<br>1<br>3<br>4<br>3<br>2<br>4<br>4<br>1<br>1<br>2|10<br>20<br>108<br>160<br>150<br>112<br>240<br>280<br>72<br>80<br>176|
|92<br>95|3<br>1|276<br>95|
|**Total**|_fi_= 30|_fixi_= 1779|



Reprint 2026-27 

STATISTICS 

173 

Now, 

**==> picture [118 x 28] intentionally omitted <==**

Therefore, the mean marks obtained is 59.3. 

In most of our real life situations, data is usually so large that to make a meaningful study it needs to be condensed as grouped data. So, we need to convert given ungrouped data into grouped data and devise some method to find its mean. 

Let us convert the ungrouped data of Example 1 into grouped data by forming class-intervals of width, say 15. Remember that, while allocating frequencies to each class-interval, students falling in any upper class-limit would be considered in the next class, e.g., 4 students who have obtained 40 marks would be considered in the classinterval 40-55 and not in 25-40. With this convention in our mind, let us form a grouped frequency distribution table (see Table 13.2). 

**Table 13.2** 

|**Class interval**|10 - 25|25 - 40|40 - 55|55 - 70|70 - 85|85 - 100|
|---|---|---|---|---|---|---|
|**Number of students**|2|3|7|6|6|6|



Now, for each class-interval, we require a point which would serve as the representative of the whole class. _It is assumed that the frequency of each classinterval is centred around its mid-point_ . So the _mid-point_ (or _class mark_ ) of each class can be chosen to represent the observations falling in the class. Recall that we find the mid-point of a class (or its class mark) by finding the average of its upper and lower limits. That is, 

**==> picture [66 x 9] intentionally omitted <==**

**Upper class limit + Lower class limit** 

**==> picture [7 x 9] intentionally omitted <==**

10 + 25 With reference to Table 13.2, for the class 10-25, the class mark is , i.e., 2 

17.5. Similarly, we can find the class marks of the remaining class intervals. We put them in Table 13.3. These class marks serve as our _xi_ ’s. Now, in general, for the _i_ th class interval, we have the frequency _fi_ corresponding to the class mark _xi_ . We can now proceed to compute the mean in the same manner as in Example 1. 

Reprint 2026-27 

174 

MATHEMATICS 

**Table 13.3** 

|**Class interval**|**Number of students** **(****_fi_)**|**Class mark** **(****_xi_)**|**_fixi_**|
|---|---|---|---|
|10 - 25<br>25 - 40|2<br>3|17.5<br>32.5|35.0<br>97.5|
|40 - 55<br>55 - 70<br>70 - 85<br>85 - 100|7<br>6<br>6<br>6|47.5<br>62.5<br>77.5<br>92.5|332.5<br>375.0<br>465.0<br>555.0|
|**Total**|Σ _fi_= 30||Σ _fixi_= 1860.0|



The sum of the values in the last column gives us Σ _fi xi_ . So, the mean _x_ of the given data is given by 

**==> picture [116 x 27] intentionally omitted <==**

This new method of finding the mean is known as the **Direct Method** . 

We observe that Tables 13.1 and 13.3 are using the same data and employing the same formula for the calculation of the mean but the results obtained are different. Can you think why this is so, and which one is more accurate? The difference in the two values is because of the mid-point assumption in Table 13.3, 59.3 being the exact mean, while 62 an approximate mean. 

Sometimes when the numerical values of _xi_ and _fi_ are large, finding the product of _xi_ and _fi_ becomes tedious and time consuming. So, for such situations, let us think of a method of reducing these calculations. 

We can do nothing with the _fi_ ’s, but we can change each _xi_ to a smaller number so that our calculations become easy. How do we do this? What about subtracting a fixed number from each of these _xi_ ’s? Let us try this method. 

The first step is to choose one among the _xi_ ’s as the _assumed mean_ , and denote it by ‘ _a_ ’. Also, to further reduce our calculation work, we may take ‘ _a_ ’ to be that _xi_ which lies in the centre of _x_ 1, _x_ 2, . . ., _xn_ . So, we can choose _a_ = 47.5 or _a_ = 62.5. Let us choose _a_ _**=**_ 47.5. 

The next step is to find the difference _di_ between _a_ and each of the _xi_ ’s, that is, the **deviation** of ‘ _a_ ’ from each of the _x_ ’s. _i_ i.e., _di_ = _xi_ – _a = xi_ – 47.5 

Reprint 2026-27 

175 

STATISTICS 

The third step is to find the product of _di_ with the corresponding _fi_ , and take the sum of all the _fi di_ ’s. The calculations are shown in Table 13.4. 

**Table 13.4** 

|**Class interval**|**Number of**<br>|**Class mark**<br>|**_di = xi – _47.5**|**_fidi_**|
|---|---|---|---|---|
||**students** **(****_fi_)**|**(****_xi_)**|||
|10 - 25<br>25 - 40<br>40 - 55<br>55 - 70<br>70 - 85<br>85 - 100|2<br>3<br>7<br>6<br>6<br>6|17.5<br>32.5<br>47.5<br>62.5<br>77.5<br>92.5|–30<br>–15<br>0<br>15<br>30<br>45|–60<br>–45<br>0<br>90<br>180<br>270|
|**Total**|Σ_fi_= 30|||Σ_fidi_= 435|
|So, from Table 13.4, the mean of the deviations,<br>_d_ =<br>_i_<br>_i_<br>_i_<br>_f d_<br>_f_<br>Σ<br>Σ<br>.|||||



Now, let us find the relation between _d_ and _x_ . Since in obtaining _di_ , we subtracted _‘a’_ from each _xi_ , so, in order to get the mean _x_ , we need to add ‘ _a_ ’ to _d_ . This can be explained mathematically as: 

**==> picture [241 x 204] intentionally omitted <==**

**----- Start of picture text -----**<br>
Mean of deviations, d  = Σ f di i<br>Σ fi<br> So, d  = Σ fi ( xi − a )<br>Σ fi<br> = Σ fi xi − Σ f ai<br>Σ fi Σ fi<br> = x − a Σ fi<br>Σ fi<br> = x − a<br>So, x  = a  +  d<br>Σ f di i<br>i.e., x  = a +<br>Σ fi<br>**----- End of picture text -----**<br>


Reprint 2026-27 

176 

MATHEMATICS 

Substituting the values of _a_ , Σ _fidi_ and Σ _fi_ from Table 13.4, we get 

**==> picture [164 x 25] intentionally omitted <==**

Therefore, the mean of the marks obtained by the students is 62. 

The method discussed above is called the **Assumed Mean Method** . 

**Activity 1 :** From the Table 13.3 find the mean by taking each of _xi_ (i.e., 17.5, 32.5, and so on) as ‘ _a_ ’. What do you observe? You will find that the mean determined in each case is the same, i.e., 62. (Why ?) 

So, we can say that the value of the mean obtained does not depend on the choice of ‘ _a_ ’. 

Observe that in Table 13.4, the values in Column 4 are all multiples of 15. So, if we divide the values in the entire Column 4 by 15, we would get smaller numbers to multiply with _fi_ . (Here, 15 is the class size of each class interval.) 

> _[x] i_ − _a_ So, let _ui_ = _h_ , where _a_ is the assumed mean and _h_ is the class size. 

Now, we calculate _ui_ in this way and continue as before (i.e., find _fi ui_ and then Σ _fiui_ ). Taking _h_ = 15, let us form Table 13.5. 

**Table 13.5** 

|**Class interval**|**_fi_**|**_x i_**|**_di = xi – a_**|**_ui =_**<br>**_ix – a_**<br>**_h_**|**_fiui_**|
|---|---|---|---|---|---|
|10 - 25<br>25 - 40<br>40 - 55<br>55 - 70<br>70 - 85<br>85 - 100|2<br>3<br>7<br>6<br>6<br>6|17.5<br>32.5<br>47.5<br>62.5<br>77.5<br>92.5|–30<br>–15<br>0<br>15<br>30<br>45|–2<br>–1<br>0<br>1<br>2<br>3|–4<br>–3<br>0<br>6<br>12<br>18|
|**Total**|Σ_fi_= 30||||Σ_fiui_= 29|



**==> picture [209 x 27] intentionally omitted <==**

Here, again let us find the relation between _u_ and _x_ . 

Reprint 2026-27 

STATISTICS 

177 

**==> picture [333 x 259] intentionally omitted <==**

**==> picture [100 x 47] intentionally omitted <==**

So, the mean marks obtained by a student is 62. 

The method discussed above is called the **Step-deviation** method. 

We note that : 

- the step-deviation method will be convenient to apply if all the _di_ ’s have a common factor. 

- The mean obtained by all the three methods is the same. 

- The assumed mean method and step-deviation method are just simplified forms of the direct method. 

- The formula ~~_x_~~ = _a_ + _h_ ~~_u_~~ still holds if _a_ and _h_ are not as given above, but are 

> _[x] i_  _a_ any non-zero numbers such that _ui_ = _h_ . 

Let us apply these methods in another example. 

Reprint 2026-27 

178 

MATHEMATICS 

**Example 2 :** The table below gives the percentage distribution of female teachers in the primary schools of rural areas of various states and union territories (U.T.) of India. Find the mean percentage of female teachers by all the three methods discussed in this section. 

|**Percentae of**|15 - 25|25 - 35|35 - 45|45 - 55|55 - 65|65 - 75|75 - 85|
|---|---|---|---|---|---|---|---|
|**g**<br>**female teachers**||||||||
|**Number of**<br>**States/U.T.**|6|11|7|4|4|2|1|



**Source :** _Seventh All India School Education Survey conducted by NCERT_ **Solution :** Let us find the class marks, _xi_ , of each class, and put them in a column (see Table 13.6): 

**Table 13.6** 

|**Percentage of female**<br>**teachers**|**Number of**<br>**States /U.T.** **(****_fi_)**|**_x i_**|
|---|---|---|
|15 - 25<br>25 - 35<br>35 - 45<br>45 - 55<br>55 - 65<br>65 - 75<br>75 - 85|6<br>11<br>7<br>4<br>4<br>2<br>1|20<br>30<br>40<br>50<br>60<br>70<br>80|



Here we take _a_ = 50, _h_ = 10, then _di_ = _xi_ – 50 and _ui_  _xi_ 10  50 . 

We now find _di_ and _ui_ and put them in Table 13.7. 

Reprint 2026-27 

STATISTICS 

179 

## **Table 13.7** 

|**Percentage of**<br>**female**<br>**teachers**|**Number of**<br>**states/U.T.**<br> **(****_fi_)**|**_xi_**|**_di = xi_ – 50**|−**50**<br>**=**<br>**10**<br>**_i_**<br>**_i_**<br>**_x_**<br>**_u_**|**_fixi_**|**_fidi_**|**_fiui_**|
|---|---|---|---|---|---|---|---|
|||||||||
|15 - 25<br>25 - 35<br>35 - 45<br>45 - 55<br>55 - 65<br>65 - 75<br>75 - 85|6<br>11<br>7<br>4<br>4<br>2<br>1|20<br>30<br>40<br>50<br>60<br>70<br>80|–30<br>–20<br>–10<br>0<br>10<br>20<br>30|–3<br>–2<br>–1<br>0<br>1<br>2<br>3|120<br>330<br>280<br>200<br>240<br>140<br>80|–180<br>–220<br>–70<br>0<br>40<br>40<br>30|–18<br>–22<br>–7<br>0<br>4<br>4<br>3|
|**Total**|**35**||||**1390 **|**–360**|**–36**|



From the table above, we obtain Σ _fi_ = 35, Σ _fixi_ = 1390, 

**==> picture [128 x 12] intentionally omitted <==**

**==> picture [227 x 42] intentionally omitted <==**

**==> picture [174 x 27] intentionally omitted <==**

Using the step-deviation method, 

**==> picture [228 x 32] intentionally omitted <==**

Therefore, the mean percentage of female teachers in the primary schools of rural areas is 39.71. 

**Remark :** The result obtained by all the three methods is the same. So the choice of method to be used depends on the numerical values of _xi_ and _fi_ . If _xi_ and _fi_ are sufficiently small, then the direct method is an appropriate choice. If _xi_ and _fi_ are numerically large numbers, then we can go for the assumed mean method or step-deviation method. If the class sizes are unequal, and _xi_ are large numerically, we can still apply the step-deviation method by taking _h_ to be a suitable divisor of all the _di_ ’s. 

Reprint 2026-27 

180 

MATHEMATICS 

**Example 3 :** The distribution below shows the number of wickets taken by bowlers in one-day cricket matches. Find the mean number of wickets by choosing a suitable method. What does the mean signify? 

|**Number of**<br>**ikt**|20 - 60|60 - 100|100 - 150|150 - 250|250 - 350|350 - 450|
|---|---|---|---|---|---|---|
|**wces**|||||||
|**Number of**<br>**bowlers**|7|5|16|12|2|3|



**Solution :** Here, the class size varies, and the _xi_ ,s are large. Let us still apply the stepdeviation method with _a_ = 200 and _h_ = 20. Then, we obtain the data as in Table 13.8. 

**Table 13.8** 

|**Number of**<br>**wickets**<br>**taken**|**Number of**<br>**bowlers**<br> **(****_fi_)**|**_xi_**|**_di = xi _– 200**|**=** **20**<br>**_i_**<br>**_i_**<br>**_d_**<br>**_u_**|**_ui fi_**|
|---|---|---|---|---|---|
|20 - 60<br>60 - 100<br>100 - 150<br>150 - 250<br>250 - 350<br>350 - 450|7<br>5<br>16<br>12<br>2<br>3|40<br>80<br>125<br>200<br>300<br>400|–160<br>–120<br>–75<br>0<br>100<br>200|–8<br>–6<br>–3.75<br>0<br>5<br>10|–56<br>–30<br>–60<br>0<br>10<br>30|
|**Total**|**45**||||**–106**|
|So,<br>106<br>45<br>−<br>=<br>⋅<br>_u_<br>Therefore,<br>_x_ = 200 +<br>106<br>20<br>45<br>−<br><br><br><br><br><br><br>= 200 – 47.11 = 152.89.||||||



This tells us that, on an average, the number of wickets taken by these 45 bowlers in one-day cricket is 152.89. 

Now, let us see how well you can apply the concepts discussed in this section! 

Reprint 2026-27 

STATISTICS 

181 

## **Activity 2 :** 

Divide the students of your class into three groups and ask each group to do one of the following activities. 

1. Collect the marks obtained by all the students of your class in Mathematics in the latest examination conducted by your school. Form a grouped frequency distribution of the data obtained. 

2. Collect the daily maximum temperatures recorded for a period of 30 days in your city. Present this data as a grouped frequency table. 

3. Measure the heights of all the students of your class (in cm) and form a grouped frequency distribution table of this data. 

After all the groups have collected the data and formed grouped frequency distribution tables, the groups should find the mean in each case by the method which they find appropriate. 

## **EXERCISE 13.1** 

**1.** A survey was conducted by a group of students as a part of their environment awareness programme, in which they collected the following data regarding the number of plants in 20 houses in a locality. Find the mean number of plants per house. 

|**Number of plants**|0 - 2|2 - 4|4 - 6|6 - 8|8 - 10|10 - 12|12 - 14|
|---|---|---|---|---|---|---|---|
|**Number of houses**|1|2|1|5|6|2|3|



Which method did you use for finding the mean, and why? 

**2.** Consider the following distribution of daily wages of 50 workers of a factory. 

|**Daily wages (in**`**)**|500 - 520|520 -540|540 - 560|560 - 580|580 -600|
|---|---|---|---|---|---|
|**Number of workers**|12|14|8|6|10|



Find the mean daily wages of the workers of the factory by using an appropriate method. 

**3.** The following distribution shows the daily pocket allowance of children of a locality. The mean pocket allowance is Rs 18. Find the missing frequency _f_ . 

|**Daily pocket**<br>|11 - 13|13 - 15|15 - 17|17 - 19|19 - 21|21 - 23|23 - 25|
|---|---|---|---|---|---|---|---|
|**allowance (in**`**)**||||||||
|**Number of children**|7|6|9|13|_f_|5|4|



Reprint 2026-27 

182 

MATHEMATICS 

**4.** Thirty women were examined in a hospital by a doctor and the number of heartbeats per minute were recorded and summarised as follows. Find the mean heartbeats per minute for these women, choosing a suitable method. 

|**Number of heartbeats** <br>**per minute**|65 - 68|68 - 71|71 - 74|74 - 77|77 - 80|80 - 83|83 - 86|
|---|---|---|---|---|---|---|---|
|**Number of women**|2|4|3|8|7|4|2|



**5.** In a retail market, fruit vendors were selling mangoes kept in packing boxes. These boxes contained varying number of mangoes. The following was the distribution of mangoes according to the number of boxes. 

|**Number of** **mangoes**|50  -  52|53  -  55|56  -  58|59  -  61|62  -  64|
|---|---|---|---|---|---|
|**Number of boxes**|15|110|135|115|25|



Find the mean number of mangoes kept in a packing box. Which method of finding the mean did you choose? 

**6.** The table below shows the daily expenditure on food of 25 households in a locality. 

|**Daily expenditure**<br>**(in**`**)**|100 - 150|150 - 200|200 - 250|250 - 300|300 - 350|
|---|---|---|---|---|---|
|**Number of**<br>**households**|4|5|12|2|2|



Find the mean daily expenditure on food by a suitable method. 

**7.** To find out the concentration of SO2 in the air (in parts per million, i.e., ppm), the data was collected for 30 localities in a certain city and is presented below: 

|**Concentration of SO2 (in ppm)**|**Frequency**|
|---|---|
|0.00  -  0.04<br>0.04  -  0.08<br>0.08  -  0.12<br>0.12  -  0.16<br>0.16  -  0.20|4<br>9<br>9<br>2<br>4|
|0.20  -  0.24|2|



Find the mean concentration of SO in the air. 2 

Reprint 2026-27 

STATISTICS 

183 

**8.** A class teacher has the following absentee record of 40 students of a class for the whole term. Find the mean number of days a student was absent. 

|**Number of**<br>**days**|0  -  6|6  -  10|10  -  14|14  -  20|20  - 28|28  -  38|38  -  40|
|---|---|---|---|---|---|---|---|
|**Number of**|11|10|7|4|4|3|1|
|**students**||||||||



**9.** The following table gives the literacy rate (in percentage) of 35 cities. Find the mean literacy rate. 

|**Literacy rate (in %)**|45  -  55|55 - 65|65  -  75|75  -  85|85  -  95|
|---|---|---|---|---|---|
|**Number of cities**|3|10|11|8|3|



## **13.3 Mode of Grouped Data** 

Recall from Class IX, a mode is that value among the observations which occurs most often, that is, the value of the observation having the maximum frequency. Further, we discussed finding the mode of ungrouped data. Here, we shall discuss ways of obtaining a mode of grouped data. It is possible that more than one value may have the same maximum frequency. In such situations, the data is said to be multimodal.  Though grouped data can also be multimodal, we shall restrict ourselves to problems having a single mode only. 

Let us first recall how we found the mode for ungrouped data through the following example. 

**Example 4 :** The wickets taken by a bowler in 10 cricket matches are as follows: 

**==> picture [258 x 9] intentionally omitted <==**

Find the mode of the data. 

**Solution :** Let us form the frequency distribution table of the given data as follows: 

|**Number of**<br>**wickets**|0|1|2|3|4|5|6|
|---|---|---|---|---|---|---|---|
|||||||||
|**Number of**<br>**matches**|1|1|3|2|1|1|1|



Reprint 2026-27 

184 

MATHEMATICS 

Clearly, 2 is the number of wickets taken by the bowler in the maximum number (i.e., 3) of matches. So, the mode of this data is 2. 

In a grouped frequency distribution, it is not possible to determine the mode by looking at the frequencies. Here, we can only locate a class with the maximum frequency, called the **modal class** . The mode is a value inside the modal class, and is given by the formula: 

**==> picture [146 x 32] intentionally omitted <==**

where _l_ = lower limit of the modal class, 

- _h_ = size of the class interval (assuming all class sizes to be equal), 

- _f_ 1 = frequency of the modal class, 

- _f_ 0 = frequency of the class preceding the modal class, 

- _f_ 2 = frequency of the class succeeding the modal class. 

Let us consider the following examples to illustrate the use of this formula. 

**Example 5 :** A survey conducted on 20 households in a locality by a group of students resulted in the following frequency table for the number of family members in a household: 

|**Family size**|1 - 3|3 - 5|5 - 7|7 - 9|9 - 11|
|---|---|---|---|---|---|
|**Number of**<br>**families**|7|8|2|2|1|



Find the mode of this data. 

**Solution :** Here the maximum class frequency is 8, and the class corresponding to this frequency is 3 – 5. So, the modal class is 3 – 5. 

Now 

modal class = 3 – 5, lower limit ( _l_ ) of modal class = 3, class size ( _h_ ) = 2 

frequency ( _f_ 1 ) of the modal class = 8, 

frequency ( _f_ 0 ) of class preceding the modal class = 7, 

frequency ( _f_ 2 ) of class succeeding the modal class = 2. 

Now, let us substitute these values in the formula : 

Reprint 2026-27 

185 

STATISTICS 

**==> picture [220 x 78] intentionally omitted <==**

Therefore, the mode of the data above is 3.286. 

**Example 6 :** The marks distribution of 30 students in a mathematics examination are given in Table 13.3 of Example 1. Find the mode of this data. Also compare and interpret the mode and the mean. 

**Solution :** Refer to Table 13.3 of Example 1. Since the maximum number of students (i.e., 7) have got marks in the interval 40 - 55, the modal class is 40 - 55. Therefore, 

the lower limit ( _l_ ) of the modal class = 40, 

the class size ( _h_ ) = 15, 

the frequency ( _f_ 1 ) of modal class = 7, 

the frequency ( _f_ 0 ) of the class preceding the modal class = 3, 

the frequency ( _f_ 2 ) of the class succeeding the modal class = 6. 

Now, using the formula: 

**==> picture [310 x 71] intentionally omitted <==**

So, the mode marks is 52. 

Now, from Example 1, you know that the mean marks is 62. 

So, the maximum number of students obtained 52 marks, while on an average a student obtained 62 marks. 

## **Remarks :** 

1. In Example 6, the mode is less than the mean. But for some other problems it may be equal or more than the mean also. 

2. It depends upon the demand of the situation whether we are interested in finding the average marks obtained by the students or the average of the marks obtained by most 

Reprint 2026-27 

186 

MATHEMATICS 

of the students. In the first situation, the mean is required and in the second situation, the mode is required. 

**Activity 3 :** Continuing with the same groups as formed in Activity 2 and the situations assigned to the groups. Ask each group to find the mode of the data. They should also compare this with the mean, and interpret the meaning of both. 

**Remark :** The mode can also be calculated for grouped data with unequal class sizes. However, we shall not be discussing it. 

## **EXERCISE 13.2** 

|**1.**|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|The following table shows the ages of the patients admitted in a hospital during a year:|
|---|---|---|---|---|---|---|---|
||**Age (in years)**|5-15|15-25|25-35|35-45|45-55|55-65|
||**Number of patients**|6|11|21|23|14|5|



Find the mode and the mean of the data given above. Compare and interpret the two measures of central tendency. 

**2.** The following data gives the information on the observed lifetimes (in hours) of 225 electrical components : 

|**Lifetimes (in hours)**|0-20|20-40|40-60|60-80|80-100|100-120|
|---|---|---|---|---|---|---|
|**Frequency**|10|35|52|61|38|29|



Determine the modal lifetimes of the components. 

**3.** The following data gives the distribution of total monthly household expenditure of 200 families of a village. Find the modal monthly expenditure of the families. Also, find the mean monthly expenditure : 

|**Expenditure (in**`**)**|**Number of families**|
|---|---|
|1000-1500<br>1500-2000<br>2000-2500<br>2500-3000<br>3000-3500|24<br>40<br>33<br>28<br>30|
|3500-4000<br>4000-4500<br>4500-5000|22<br>16<br>7|



Reprint 2026-27 

STATISTICS 

187 

**4.** The following distribution gives the state-wise teacher-student ratio in higher secondary schools of India. Find the mode and mean of this data. Interpret the two measures. 

|**Number of students per teacher**|**Number of states / U.T.**|
|---|---|
|15-20|3|
|<br>20-25<br>25-30<br>30-35<br>35-40<br>40-45<br>45-50<br>50-55|8<br>9<br>10<br>3<br>0<br>0<br>2|



**5.** The given distribution shows the number of runs scored by some top batsmen of the world in one-day international cricket matches. 

|**Runs scored**|**Number of batsmen**|
|---|---|
|3000-4000<br>4000-5000<br>5000-6000<br>6000-7000<br>7000-8000<br>8000-9000<br>9000-10000<br>10000-11000|4<br>18<br>9<br>7<br>6<br>3<br>1<br>1|



Find the mode of the data. 

**6.** A student noted the number of cars passing through a spot on a road for 100 periods each of 3 minutes and summarised it in the table given below. Find the mode of the data : 

|**Number of cars**|0-10|10-20|20-30|30-40|40-50|50-60|60-70|70-80|
|---|---|---|---|---|---|---|---|---|
||||||||||
|**Frequency**|7|14|13|12|20|11|15|8|



Reprint 2026-27 

188 

MATHEMATICS 

## **13.4 Median of Grouped Data** 

As you have studied in Class IX, the median is a measure of central tendency which gives the value of the middle-most observation in the data. Recall that for finding the median of ungrouped data, we first arrange the data values of the observations in 

 _n_  1  ascending order. Then, if _n_ is odd, the median is the    2 [th observation. And, if ] _[n] n_  _n_  is even, then the median will be the average of the th and the   1  th observations. 2  2  

Suppose, we have to find the median of the following data, which gives the marks, out of 50, obtained by 100 students in a test : 

|**Marks obtained**|20|29|28|33|42|38|43|25|
|---|---|---|---|---|---|---|---|---|
|**Number of students**|6|28|24|15|2|4|1|20|



First, we arrange the marks in ascending order and prepare a frequency table as follows : 

**Table 13.9** 

|**Marks obtained**|**Number of students**<br>**(Frequency)**|
|---|---|
|20<br>25<br>28<br>29<br>33<br>38<br>42|6<br>20<br>24<br>28<br>15<br>4<br>2|
|43|1|
|**Total**|**100**|



Reprint 2026-27 

STATISTICS 

189 

Here _n_ = 100, which is even. The median will be the average of the 

_n_ th and the 2 

 _n_    1  th observations, i.e., the 50th and 51st observations. To find these  2  

observations, we proceed as follows: 

**Table 13.10** 

|**Marks obtained**|**Number of students**|
|---|---|
|20<br>upto 25<br>upto 28<br>upto 29<br>upto 33<br>upto 38<br>upto 42<br>upto 43|6<br>6 + 20 = 26<br>26 + 24 = 50<br>50 + 28 = 78<br>78 + 15 = 93<br>93 + 4 = 97<br>97 + 2 = 99<br>99 + 1 = 100|



Now we add another column depicting this information to the frequency table above and name it as _cumulative frequency column_ . 

**Table 13.11** 

|**Marks obtained**|**Number of students**|**Cumulative frequency**|
|---|---|---|
|20<br>25<br>28<br>29<br>33<br>38|6<br>20<br>24<br>28<br>15<br>4|6<br>26<br>50<br>78<br>93<br>97|
|42<br>43|2<br>1|99<br>100|



Reprint 2026-27 

190 

MATHEMATICS 

From the table above, we see that: 

50th observaton is 28 (Why?) 51st observation is 29 

**==> picture [208 x 24] intentionally omitted <==**

**Remark :** The part of Table 13.11 consisting Column 1 and Column 3 is known as _Cumulative Frequency Table_ . The median marks 28.5 conveys the information that about 50% students obtained marks less than 28.5 and another 50% students obtained marks more than 28.5. 

Now, let us see how to obtain the median of grouped data, through the following situation. 

Consider a grouped frequency distribution of marks obtained, out of 100, by 53 students, in a certain examination, as follows: 

|**Table 13.12**|**Table 13.12**|
|---|---|
|**Marks**|**Number of students**|
|0 - 10<br>10 - 20<br>20 - 30<br>30 - 40<br>40 - 50<br>50 - 60<br>60 - 70<br>70 - 80<br>80 - 90<br>90 - 100|5<br>3<br>4<br>3<br>3<br>4<br>7<br>9<br>7<br>8|



From the table above, try to answer the following questions: 

How many students have scored marks less than 10? The answer is clearly 5. 

Reprint 2026-27 

STATISTICS 

191 

How many students have scored less than 20 marks? Observe that the number of students who have scored less than 20 include the number of students who have scored marks from 0 - 10 as well as the number of students who have scored marks from 10 - 20. So, the total number of students with marks less than 20 is 5 + 3, i.e., 8. We say that the cumulative frequency of the class 10 -20 is 8. 

Similarly, we can compute the cumulative frequencies of the other classes, i.e., the number of students with marks less than 30, less than 40, . . ., less than 100. We give them in Table 13.13 given below: 

## **Table 13.13** 

|**Marks obtained**|**Number of students**<br>**(Cumulative frequency)**|
|---|---|
|Less than 10<br>5<br>Less than 20<br>5 + 3 = 8<br>Less than 30<br>8 + 4 = 12<br>Less than 40<br>12 + 3 = 15<br>Less than 50<br>15 + 3 = 18<br>Less than 60<br>18 + 4 = 22<br>Less than 70<br>22 + 7 = 29<br>Less than 80<br>29 + 9 = 38<br>Less than 90<br>38 + 7 = 45<br>Less than 100<br>45 + 8 = 53||



The distribution given above is called the _cumulative frequency distribution of the less than type_ . Here 10, 20, 30, . . . 100, are the upper limits of the respective class intervals. 

We can similarly make the table for the number of students with scores, more than or equal to 0, more than or equal to 10, more than or equal to 20, and so on. From Table 13.12, we observe that all 53 students have scored marks more than or equal to 0. Since there are 5 students scoring marks in the interval 0 - 10, this means that there are 53 – 5 = 48 students getting more than or equal to 10 marks. Continuing in the same manner, we get the number of students scoring 20 or above as 48 – 3 = 45, 30 or above as 45 – 4 = 41, and so on, as shown in Table 13.14. 

Reprint 2026-27 

192 

MATHEMATICS 

**Table 13.14** 

**==> picture [321 x 188] intentionally omitted <==**

**----- Start of picture text -----**<br>
Marks obtained Number of students<br>(Cumulative frequency)<br>More than or equal to 0 53<br>More than or equal to 10 53 – 5 = 48<br>More than or equal to 20 48 – 3 = 45<br>More than or equal to 30 45 – 4 = 41<br>More than or equal to 40 41 – 3 = 38<br>More than or equal to 50 38 – 3 = 35<br>More than or equal to 60 35 – 4 = 31<br>More than or equal to 70 31 – 7 = 24<br>More than or equal to 80 24 – 9 = 15<br>More than or equal to 90 15 – 7 =  8<br>**----- End of picture text -----**<br>


The table above is called a _cumulative frequency distribution of the more than type_ . Here 0, 10, 20, . . ., 90 give the lower limits of the respective class intervals. 

Now, to find the median of grouped data, we can make use of any of these cumulative frequency distributions. 

Let us combine Tables 13.12 and 13.13 to get Table 13.15 given below: 

**Table 13.15** 

|**Marks**|**Number of students** **(****_f_ )**|**Cumulative frequency** **(cf)**|
|---|---|---|
|0 - 10<br>10 - 20<br>20 - 30<br>30 - 40<br>40 - 50<br>50 - 60<br>60 - 70<br>70 - 80<br>80 - 90<br>|5<br>3<br>4<br>3<br>3<br>4<br>7<br>9<br>7<br>|5<br>8<br>12<br>15<br>18<br>22<br>29<br>38<br>45<br>|
|90 - 100|8|53|



Now in a grouped data, we may not be able to find the middle observation by looking at the cumulative frequencies as the middle observation will be some value in 

Reprint 2026-27 

STATISTICS 

193 

a class interval. It is, therefore, necessary to find the value inside a class that divides the whole distribution into two halves. But which class should this be? 

_n_ To find this class, we find the cumulative frequencies of all the classes and . 2 We now locate the class whose cumulative frequency is greater than (and nearest to) _n n_  This is called the _median class_ . In the distribution above, _n_ = 53. So, = 26.5. 2 2 Now 60 – 70 is the class whose cumulative frequency 29 is greater than (and nearest _n_ to) , i.e., 26.5. 2 

Therefore, 60 – 70 is the **median class** . 

After finding the median class, we use the following formula for calculating the median. 

**==> picture [132 x 53] intentionally omitted <==**

where _l_ = lower limit of median class, 

_n_ = number of observations, 

cf = cumulative frequency of class preceding the median class, 

_f_ = frequency of median class, 

_h_ = class size (assuming class size to be equal). 

_n_ Substituting the values  26.5, _l_ = 60, cf = 22, _f_ = 7, _h_ = 10 2 in the formula above, we get 

**==> picture [154 x 82] intentionally omitted <==**

So, about half the students have scored marks less than 66.4, and the other half have scored marks more than 66.4. 

Reprint 2026-27 

194 

MATHEMATICS 

**Example 7 :** A survey regarding the heights (in cm) of 51 girls of Class X of a school was conducted and the following data was obtained: 

|**Height (in cm)**|**Number of girls**|
|---|---|
|Less than 140|4|
|Less than 145<br>Less than 150<br>Less than 155<br>Less than 160<br>Less than 165|11<br>29<br>40<br>46<br>51|



## Find the median height. 

**Solution :** To calculate the median height, we need to find the class intervals and their corresponding frequencies. 

The given distribution being of the _less than type_ , 140, 145, 150, . . ., 165 give the upper limits of the corresponding class intervals. So, the classes should be below 140, 140 - 145, 145 - 150, . . ., 160 - 165. Observe that from the given distribution, we find that there are 4 girls with height less than 140, i.e., the frequency of class interval below 140 is 4. Now, there are 11 girls with heights less than 145 and 4 girls with height less than 140. Therefore, the number of girls with height in the interval 140 - 145 is 11 – 4 = 7. Similarly, the frequency of 145 - 150 is 29 – 11 = 18, for 150 - 155, it is 40 – 29 = 11, and so on. So, our frequency distribution  table with the given cumulative frequencies becomes: 

**Table 13.16** 

|**Class intervals**|**Frequency**|**Cumulative frequency**|
|---|---|---|
|Below 140<br>140 - 145<br>145 - 150<br>150 - 155|4<br>7<br>18<br>11|4<br>11<br>29<br>40|
|155 - 160<br>160 - 165|6<br>5|46<br>51|



Reprint 2026-27 

195 

STATISTICS 

_n_ 51 Now _n_ = 51. So, = = 25.5 . This observation lies in the class 145 - 150. Then, 2 2 

**==> picture [109 x 10] intentionally omitted <==**

cf (the cumulative frequency of the class preceding 145 - 150) = 11, 

_f_ (the frequency of the median class 145 - 150) = 18, _h_ (the class size) = 5. 

**==> picture [260 x 131] intentionally omitted <==**

So, the median height of the girls is 149.03 cm. 

This means that the height of about 50% of the girls is less than this height, and 50% are taller than this height. 

**Example 8 :** The median of the following data is 525. Find the values of _x_ and _y_ , if the total frequency is 100. 

|**Class intervals**|**Frequency**|
|---|---|
|0 - 100<br>100 - 200<br>200 - 300<br>300 - 400<br>400 - 500<br>500 - 600<br>600 - 700<br>|2<br>5<br>_x_<br>12<br>17<br>20<br>_y_<br>|
|700 - 800<br>800 - 900<br>900 - 1000|9<br>7<br>4|



Reprint 2026-27 

196 

MATHEMATICS 

## **Solution :** 

|**Class intervals**|**Frequency**|**Cumulative frequency**|
|---|---|---|
|0 - 100<br>100 - 200|2<br>5|2<br>7|
|200 - 300<br>300 - 400<br>400 - 500<br>500 - 600<br>600 - 700<br>700 - 800<br>800 - 900<br>900 - 1000|_x_<br>12<br>17<br>20<br>_y_<br>9<br>7<br>4|7 +_x_<br>19 +_x_<br>36 +_x_<br>56 +_x_<br>56 +_x_+_y_<br>65 +_x_+_y_<br>72 +_x_+_y_<br>76 +_x_+_y_|
|It is given that_n_= 100<br>So,<br>76 +_x_+_y_= 100,<br>i.e.,<br>_x_+_y_= 24<br>(1)|||



It is given that _n_ = 100 So, 76 + _x_ + _y_ = 100, i.e., _x_ + _y_ = 24 The median is 525, which lies in the class 500 – 600 

So, _l_ = 500, _f_ = 20, cf = 36 + _x_ , _h_ = 100 

**==> picture [315 x 213] intentionally omitted <==**

Reprint 2026-27 

STATISTICS 

197 

Now, that you have studied about all the three measures of central tendency, let us discuss **which measure would be best suited for a particular requirement** . 

The mean is the most frequently used measure of central tendency because it takes into account all the observations, and lies between the extremes, i.e., the largest and the smallest observations of the entire data. It also enables us to compare two or more distributions. For example, by comparing the average (mean) results of students of different schools of a particular examination, we can conclude which school has a better performance. 

However, extreme values in the data affect the mean. For example, the mean of classes having frequencies more or less the same is a good representative of the data. But, if one class has frequency, say 2, and the five others have frequency 20, 25, 20, 21, 18, then the mean will certainly not reflect the way the data behaves. So, in such cases, the mean is not a good representative of the data. 

In problems where individual observations are not important, and we wish to find out a ‘typical’ observation, the median is more appropriate, e.g., finding the typical productivity rate of workers, average wage in a country, etc. These are situations where extreme values may be there. So, rather than the mean, we take the median as a better measure of central tendency. 

In situations which require establishing the most frequent value or most popular item, the mode is the best choice, e.g., to find the most popular T.V. programme being watched, the consumer item in greatest demand, the colour of the vehicle used by most of the people, etc. 

## **Remarks :** 

1. There is a empirical relationship between the three measures of central tendency : 

## **3 Median = Mode + 2 Mean** 

2. The median of grouped data with unequal class sizes can also be calculated. However, we shall not discuss it here. 

Reprint 2026-27 

198 

MATHEMATICS 

## **EXERCISE 13.3** 

**1.** The following frequency distribution gives the monthly consumption of electricity of 68 consumers of a locality. Find the median, mean and mode of the data and compare them. 

|||
|---|---|
|**Monthly consumption (in units)**|**Number of consumers**|
|65-85<br>85-105<br>105-125<br>125-145<br>145-165<br>165-185<br>185-205|4<br>5<br>13<br>20<br>14<br>8<br>4|



**2.** If the median of the distribution given below is 28.5, find the values of _x_ and _y_ . 

|**Class interval**|**Frequency**|
|---|---|
|0-10<br>10-20<br>20-30<br>30-40<br>40-50<br>50-60|5<br>_x_<br>20<br>15<br>_y_<br>5|
|**Total**|60|



**3.** A life insurance agent found the following data for distribution of ages of 100 policy holders. Calculate the median age, if policies are given only to persons having age 18 years onwards but less than 60 year. 

Reprint 2026-27 

STATISTICS 

199 

|**Age (in years)**|**Number of policy holders**|
|---|---|
|Below 20<br>Below 25<br>|2<br>6<br>|
|Below 30<br>Below 35<br>Below 40<br>Below 45<br>Below 50<br>Below 55<br>Below 60|24<br>45<br>78<br>89<br>92<br>98<br>100|



**4.** The lengths of 40 leaves of a plant are measured correct to the nearest millimetre, and the data obtained is represented in the following table : 

|**Length (in mm)**|**Number of leaves**|
|---|---|
|118-126<br>127-135<br>136-144<br>145-153<br>154-162<br>163-171<br>172-180|3<br>5<br>9<br>12<br>5<br>4<br>2|



Find the median length of the leaves. 

( **Hint :** The data needs to be converted to continuous classes for finding the median, since the formula assumes continuous classes. The classes then change to 117.5 - 126.5, 126.5 - 135.5, . . ., 171.5 - 180.5.) 

Reprint 2026-27 

200 

MATHEMATICS 

## **5.** The following table gives the distribution of the life time of 400 neon lamps : 

|**Life time (in hours)**|**Number of lamps**|
|---|---|
|1500-2000<br>|14<br>|
|2000-2500<br>2500-3000<br>3000-3500<br>3500-4000<br>4000-4500<br>4500-5000|56<br>60<br>86<br>74<br>62<br>48|



Find the median life time of a lamp. 

**6.** 100 surnames were randomly picked up from a local telephone directory and the frequency distribution of the number of letters in the English alphabets in the surnames was obtained as follows: 

|**Number of letters**|1-4|4-7|7-10|10-13|13-16|16-19|
|---|---|---|---|---|---|---|
|**Number of surnames**|6|30|40|16|4|4|



Determine the median number of letters in the surnames. Find the mean number of letters in the surnames? Also, find the modal size of the surnames. 

**7.** The distribution below gives the weights of 30 students of a class. Find the median weight of the students. 

|**Weight (in kg)**|40-45|45-50|50-55|55-60|60-65|65-70|70-75|
|---|---|---|---|---|---|---|---|
|**Number of students**|2|3|8|6|6|3|2|



## **13.5 Summary** 

In this chapter, you have studied the following points: 

**1.** The mean for grouped data can be found by : 

**==> picture [191 x 53] intentionally omitted <==**

Reprint 2026-27 

STATISTICS 

201 

**==> picture [221 x 29] intentionally omitted <==**

with the assumption that the frequency of a class is centred at its mid-point, called its class mark. 

**2.** The mode for grouped data can be found by using the formula: 

**==> picture [135 x 29] intentionally omitted <==**

where symbols have their usual meanings. 

**3.** The cumulative frequency of a class is the frequency obtained by adding the frequencies of all the classes preceding the given class. 

**4.** The median for grouped data is formed by using the formula: 

**==> picture [123 x 49] intentionally omitted <==**

**----- Start of picture text -----**<br>
 n  cf <br>2<br>Median =  l     h ,<br> f <br> <br> <br>**----- End of picture text -----**<br>


where symbols have their usual meanings. 

## **A NOTE TO THE READER** 

For calculating mode and median for grouped data, it should be ensured that the class intervals are continuous before applying the formulae. Same condition also apply for construction of an ogive. Further, in case of ogives, the scale may not be the same on both the axes. 

Reprint 2026-27 

