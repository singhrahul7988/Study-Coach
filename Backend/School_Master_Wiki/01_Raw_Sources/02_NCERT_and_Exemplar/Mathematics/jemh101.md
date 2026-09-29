---
source_file: jemh101.pdf
type: Official_Educational_Resource
---

# DOCUMENT: jemh101
*LLM INSTRUCTION: This is a verified raw source. Use this content to answer questions or generate study plans.*

1 

REAL NUMBERS 

**==> picture [85 x 85] intentionally omitted <==**

## **REAL NUMBERS** 

**1** 

## **1.1 Introduction** 

In Class IX, you began your exploration of the world of real numbers and encountered irrational numbers. We continue our discussion on real numbers in this chapter. We begin with very important properties of positive integers in Sections 1.2, namely the Euclid’s division algorithm and the Fundamental Theorem of Arithmetic. 

Euclid’s division algorithm, as the name suggests, has to do with divisibility of integers. Stated simply, it says any positive integer _a_ can be divided by another positive integer _b_ in such a way that it leaves a remainder _r_ that is smaller than _b_ . Many of you probably recognise this as the usual long division process. Although this result is quite easy to state and understand, it has many applications related to the divisibility properties of integers. We touch upon a few of them, and use it mainly to compute the HCF of two positive integers. 

The Fundamental Theorem of Arithmetic, on the other hand, has to do something with multiplication of positive integers. You already know that every composite number can be expressed as a product of primes in a unique way—this important fact is the Fundamental Theorem of Arithmetic. Again, while it is a result that is easy to state and understand, it has some very deep and significant applications in the field of mathematics. We use the Fundamental Theorem of Arithmetic for two main applications. First, we use it to prove the irrationality of many of the numbers you studied in Class IX, such as 2, 3  and 5 . Second, we apply this theorem to explore when exactly the decimal _p_ expansion of a rational number, say ( _q_  0) , is terminating and when it is non- _q_ terminating repeating. We do so by looking at the prime factorisation of the denominator _q_ of _qp_[. You will see that the prime factorisation of ] _[q]_[ will completely reveal the nature] of the decimal expansion of _p q_[.] So let us begin our exploration. 

Reprint 2026-27 

2 

MATHEMATICS 

## **1.2 The Fundamental Theorem of Arithmetic** 

In your earlier classes, you have seen that any natural number can be written as a product of its prime factors. For instance, 2 = 2, 4 = 2 × 2, 253 = 11 × 23, and so on. Now, let us try and look at natural numbers from the other direction. That is, can any natural number be obtained by multiplying prime numbers? Let us see. 

Take any collection of prime numbers, say 2, 3, 7, 11 and 23. If we multiply some or all of these numbers, allowing them to repeat as many times as we wish, we can produce a large collection of positive integers (In fact, infinitely many). Let us list a few : 

**==> picture [257 x 43] intentionally omitted <==**

and so on. 

Now, let us suppose your collection of primes includes all the possible primes. What is your guess about the size of this collection? Does it contain only a finite number of integers, or infinitely many? Infact, there are infinitely many primes. So, if we combine all these primes in all possible ways, we will get an infinite collection of numbers, all the primes and all possible products of primes. The question is – can we produce all the composite numbers this way? What do you think? Do you think that there may be a composite number which is not the product of powers of primes? Before we answer this, let us factorise positive integers, that is, do the opposite of what we have done so far. 

We are going to use the factor tree with which you are all familiar. Let us take some large number, say, 32760, and factorise it as shown. 

**==> picture [119 x 71] intentionally omitted <==**

Reprint 2026-27 

3 

REAL NUMBERS 

So we have factorised 32760 as 2 × 2 × 2 × 3 × 3 × 5 × 7 × 13 as a product of primes, i.e., 32760 = 2[3] × 3[2] × 5 × 7 × 13 as a product of powers of primes. Let us try another number, say, 123456789. This can be written as 3[2] × 3803 × 3607. Of course, you have to check that 3803 and 3607 are primes! (Try it out for several other natural numbers yourself.)   This leads us to a conjecture that every composite number can be written as the product of powers of primes. In fact, this statement is true, and is called the **Fundamental Theorem of Arithmetic** because of its basic crucial importance to the study of integers. Let us now formally state this theorem. 

**Theorem 1.1 (Fundamental Theorem of Arithmetic) :** _Every composite number can be expressed_ ( _factorised_ ) _as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur._ 

An equivalent version of Theorem 1.2 was probably first recorded as Proposition 14 of Book IX in Euclid’s Elements, before it came to be known as the Fundamental Theorem of Arithmetic. However, the first correct proof was given by Carl Friedrich Gauss in his _Disquisitiones Arithmeticae_ . 

Carl Friedrich Gauss is often referred to as the ‘Prince of Mathematicians’ and is considered one of the three greatest mathematicians of all time, along with Archimedes and Newton. He has made fundamental contributions to both mathematics and science. 

**Carl Friedrich Gauss (1777 – 1855)** 

The Fundamental Theorem of Arithmetic says that every composite number can be factorised as a product of primes. Actually it says more. It says that given any composite number it can be factorised as a product of prime numbers in a **‘unique’** way, except for the order in which the primes occur. That is, given any composite number there is one and only one way to write it as a product of primes, as long as we are not particular about the order in which the primes occur. So, for example, we regard 2 × 3 × 5 × 7 as the same as 3 × 5 × 7 × 2, or any other possible order in which these primes are written. This fact is also stated in the following form: 

_The prime factorisation of a natural number is unique, except for the order of its factors_ . 

Reprint 2026-27 

4 

MATHEMATICS 

In general, given a composite number _x_ , we factorise it as _x_ = _p_ 1 _p_ 2 ... _pn_ , where _p_ 1, _p_ 2,..., _pn_ are primes and written in ascending order, i.e., _p_ 1  _p_ 2  . . .  _pn._ If we combine the same primes, we will get powers of primes. For example, 32760 = 2 × 2 × 2 × 3 × 3 × 5 × 7 × 13 = 2[3] × 3[2] × 5 × 7 × 13 

Once we have decided that the order will be ascending, then the way the number is factorised, is unique. 

The Fundamental Theorem of Arithmetic has many applications, both within mathematics and in other fields. Let us look at some examples. 

**Example 1 :** Consider the numbers 4 _[n]_ , where _n_ is a natural number. Check whether there is any value of _n_ for which 4 _[n]_ ends with the digit zero. 

**Solution :** If the number 4 _[n]_ , for any _n_ , were to end with the digit zero, then it would be divisible by 5. That is, the prime factorisation of 4 _[n]_ would contain the prime 5. This is not possible because 4 _[n]_ = (2)[2] _[n]_ ; so the only prime in the factorisation of 4 _[n]_ is 2. So, the uniqueness of the Fundamental Theorem of Arithmetic guarantees that there are no other primes in the factorisation of 4 _[n] ._ So, there is no natural number _n_ for which 4 _[n]_ ends with the digit zero. 

You have already learnt how to find the HCF and LCM of two positive integers using the Fundamental Theorem of Arithmetic in earlier classes, without realising it! This method is also called the _prime factorisation method_ . Let us recall this method through an example. 

**Example 2 :** Find the LCM and HCF  of 6 and 20 by the prime factorisation method. **Solution :** We have : 6 = 2[1] × 3[1] and 20 = 2 × 2 × 5 = 2[2] × 5[1] . 

You can find HCF(6, 20) = 2 and LCM(6, 20) = 2 × 2 × 3 × 5 = 60, as done in your earlier classes. 

Note that HCF(6, 20) = 2[1] = **Product of the smallest power of each common prime factor in the numbers.** 

LCM (6, 20) = 2[2] × 3[1] × 5[1] = **Product of the greatest power of each prime factor** , **involved in the numbers** . 

From the example above, you might have noticed that HCF(6, 20) × LCM(6, 20) = 6 × 20. In fact, we can verify that **for any two positive integers** _**a**_ **and** _**b**_ **, HCF (** _**a**_ **,** _**b**_ **) × LCM (** _**a**_ **,** _**b**_ **) =** _**a**_ **×** _**b**_ **.** We can use this result to find the LCM of two positive integers, if we have already found the HCF of the two positive integers. 

**Example 3:** Find the HCF of 96 and 404 by the prime factorisation method. Hence, find their LCM. 

Reprint 2026-27 

5 

REAL NUMBERS 

**Solution :** The prime factorisation of 96 and 404 gives : 

96 = 2[5] × 3, 404 = 2[2] × 101 

Therefore, the HCF of these two integers is 2[2] = 4. 

**==> picture [337 x 26] intentionally omitted <==**

**Example 4 :** Find the HCF and LCM of 6, 72 and 120, using the prime factorisation method. 

**Solution :** We have : 

6 = 2 × 3, 72 = 2[3] × 3[2] , 120 = 2[3] × 3 × 5 

Here, 2[1] and 3[1] are the smallest powers of the common factors 2 and 3, respectively. So, HCF (6, 72, 120) = 2[1] × 3[1] = 2 × 3 = 6 

2[3] , 3[2] and 5[1] are the greatest powers of the prime factors 2, 3 and 5 respectively involved in the three numbers. 

So, LCM (6, 72, 120) = 2[3 ] × 3[2] × 5[1] = 360 

**Remark :** Notice, 6 × 72 × 120  HCF (6, 72, 120) × LCM (6, 72, 120). So, the product of three numbers is not equal to the product of their HCF and LCM. 

## **EXERCISE 1.1** 

**1.** Express each number as a product of its prime factors: 

(i) 140 (ii) 156 (iii) 3825 (iv) 5005 (v) 7429 

**2.** Find the LCM and HCF of the following pairs of integers and verify that LCM × HCF = product of the two numbers. 

(i) 26 and 91 (ii) 510 and 92 (iii) 336 and 54 

**3.** Find the LCM and HCF of the following integers by applying the prime factorisation method. 

(i) 12, 15 and 21 (ii) 17, 23 and 29 (iii) 8, 9 and 25 

**4.** Given that HCF (306, 657) = 9, find LCM (306, 657). 

**5.** Check whether 6 _[n]_ can end with the digit 0 for any natural number _n_ . 

**6.** Explain why 7 × 11 × 13 + 13 and 7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 are composite numbers. 

**7.** There is a circular path around a sports field. Sonia takes 18 minutes to drive one round of the field, while Ravi takes 12 minutes for the same. Suppose they both start at the 

Reprint 2026-27 

6 

MATHEMATICS 

same point and at the same time, and go in the same direction. After how many minutes will they meet again at the starting point? 

## **1.3 Revisiting Irrational Numbers** 

In Class IX, you were introduced to irrational numbers and many of their properties. You studied about their existence and how the rationals and the irrationals together made up the real numbers. You even studied how to locate irrationals on the number line. However, we did not prove that they were irrationals. In this section, we will prove that 2 , 3 , 5  and, in general, _p_ is irrational, where _p_ is a prime. One of the theorems, we use in our proof, is the Fundamental Theorem of Arithmetic. 

_p_ Recall, a number ‘ _s_ ’ is called _irrational_ if it cannot be written in the form , _q_ where _p_ and _q_ are integers and _q_ ¹ 0. Some examples of irrational numbers, with which you are already familiar, are : 

**==> picture [217 x 25] intentionally omitted <==**

Before we prove that 2[ is irrational, we need the following theorem, whose] proof is based on the Fundamental Theorem of Arithmetic. 

**Theorem 1.2 :** _Let p be a prime number. If p divides a[2] , then p divides a, where a is a positive integer._ 

***Proof :** Let the prime factorisation of _a_ be as follows : 

_a_ = _p_ 1 _p_ 2 . . . _pn_ , where _p_ 1, _p_ 2, . . ., _pn_ are primes, not necessarily distinct. 

Therefore, _a_[2] = ( _p_ 1 _p_ 2 . . . _pn_ )( _p_ 1 _p_ 2 . . . _pn_ ) = _p_[2] 1 _[p]_ 2[2][ . . . ] _[p]_[2] _n_[.] 

Now, we are given that _p_ divides _a_[2] . Therefore, from the Fundamental Theorem of Arithmetic, it follows that _p_ is one of the prime factors of _a_[2] . However, using the uniqueness part of the Fundamental Theorem of Arithmetic, we realise that the only prime factors of _a_[2] are _p_ 1, _p_ 2, . . ., _pn_ . So _p_ is one of _p_ 1, _p_ 2, . . ., _pn_ . 

Now, since _a_ = _p_ 1 _p_ 2 . . . _pn_ , _p_ divides _a_ . 

We are now ready to give a proof that 2[ is irrational.] 

The proof is based on a technique called ‘proof by contradiction’. (This technique is discussed in some detail in Appendix 1). 

**Theorem 1.3 :** 2 _[ is irrational.]_ 

**Proof :** Let us assume, to the contrary, that 2[ is rational.] 

* Not from the examination point of view. 

Reprint 2026-27 

REAL NUMBERS 

7 

_r_ So, we can find integers _r_ and _s_ (¹ 0) such that 2[ = ] _s_[.] 

Suppose _r_ and _s_ have a common factor other than 1. Then, we divide by the common 

_a_ factor to get 2  , where _a_ and _b_ are coprime. _b_ So, _b_ 2[ = ] _[a]_[.] 

Squaring on both sides and rearranging, we get 2 _b_[2] = _a_[2] . Therefore, 2 divides _a_[2] . Now, by Theorem 1.2, it follows that 2 divides _a_ . 

So, we can write _a_ = 2 _c_ for some integer _c_ . Substituting for _a_ , we get 2 _b_[2] = 4 _c_[2] , that is, _b_[2] = 2 _c_[2] . 

This means that 2 divides _b_[2] , and so 2 divides _b_ (again using Theorem 1.2 with _p_ = 2). Therefore, _a_ and _b_ have at least 2 as a common factor. 

But this contradicts the fact that _a_ and _b_ have no common factors other than 1. 

This contradiction has arisen because of our incorrect assumption that 2  is rational. 

So, we conclude that 2[ is irrational.] 

**Example 5 :** Prove that 3[ is irrational.] 

**Solution :** Let us assume, to the contrary, that 3[ is rational.] 

_a_ That is, we can find integers _a_ and _b_ (¹ 0) such that 3[ = ] _b_[] 

Suppose _a_ and _b_ have a common factor other than 1, then we can divide by the common factor, and assume that _a_ and _b_ are coprime. 

So, _b_ 3  _a_  

Squaring on both sides, and rearranging, we get 3 _b_[2] = _a_[2] . 

Therefore, _a_[2] is divisible by 3, and by Theorem 1.2, it follows that _a_ is also divisible by 3. 

So, we can write _a_ = 3 _c_ for some integer _c_ . Substituting for _a_ , we get 3 _b_[2] = 9 _c_[2] , that is, _b_[2] = 3 _c_[2] . 

This means that _b_[2] is divisible by 3, and so _b_ is also divisible by 3 (using Theorem 1.2 with _p_ = 3). 

Reprint 2026-27 

8 

MATHEMATICS 

Therefore, _a_ and _b_ have at least 3 as a common factor. 

But this contradicts the fact that _a_ and _b_ are coprime. 

> This contradiction has arisen because of our incorrect assumption that 3  is rational. 

> So, we conclude that 3  is irrational. 

In Class IX, we mentioned that : 

- the sum or difference of a rational and an irrational number is irrational and 

- the product and quotient of a non-zero rational and irrational number is irrational. 

We prove some particular cases here. 

**Example 6 :** Show that 5 – 3  is irrational. 

**Solution :** Let us assume, to the contrary, that 5 – 3  is rational. 

_a_ That is, we can find coprime _a_ and _b_ ( _b_  0) such that 5  3   _b_ 

**==> picture [334 x 88] intentionally omitted <==**

> This contradiction has arisen because of our incorrect assumption that 5 – 3  is rational. 

So, we conclude that 5  3 is irrational. 

**Example 7 :** Show that 3 2 is irrational. 

**Solution :** Let us assume, to the contrary, that 3 2 is rational. 

**==> picture [288 x 21] intentionally omitted <==**

**==> picture [298 x 48] intentionally omitted <==**

Reprint 2026-27 

9 

REAL NUMBERS 

But this contradicts the fact that 2[ is irrational.] 

So, we conclude that 3 2 is irrational. 

## **EXERCISE 1.2** 

**1.** Prove that 5[ is irrational.] 

**2.** Prove that 3  2 5 is irrational. 

**3.** Prove that the following are irrationals : 

**==> picture [222 x 23] intentionally omitted <==**

**----- Start of picture text -----**<br>
1<br>(i) (ii) 7 5 (iii) 6  2<br>2<br>**----- End of picture text -----**<br>


## **1.4 Summary** 

In this chapter, you have studied the following points: 

**1.** The Fundamental Theorem of Arithmetic : 

Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur. 

**2.** If _p_ is a prime and _p_ divides _a_[2] , then _p_ divides _a_ , where _a_ is a positive integer. 

**3.** To prove that 2, 3  are irrationals. 

## **A NOTE TO THE READER** 

You have seen that : 

HCF ( _p_ , _q_ , _r_ ) × LCM ( _p_ , _q_ , _r_ )  _p_ × _q_ × _r_ , where _p_ , _q_ , _r_ are positive integers (see Example 8). However, the following results hold good for three numbers _p_ , _q_ and _r_ : 

_p_  _q r_ HCF( _p_ , _q_ , _r_ ) LCM ( _p_ , _q_ , _r_ ) = HCF( _p_ , _q_ )  HCF( _q_ , _r_ )  HCF( _p_ , _r_ ) _p_  _q r_ LCM( _p_ , _q_ , _r_ ) HCF ( _p_ , _q_ , _r_ ) = LCM( _p_ , _q_ )  LCM( _q_ , _r_ )  LCM( _p_ , _r_ ) 

Reprint 2026-27 

