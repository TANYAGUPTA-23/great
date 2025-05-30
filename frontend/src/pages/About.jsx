import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title';
import NewsletterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi, pariatur, alias cupiditate natus porro modi deleniti quisquam ipsam atque culpa aliquid iusto cumque, temporibus commodi? Sed expedita magni ducimus ullam.</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis nihil reprehenderit, expedita dicta inventore consequatur ipsa veniam corrupti illum animi corporis, at ab qui, facilis modi. Ea odit omnis porro.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia, suscipit nemo sapiente, provident culpa expedita perferendis quod quia amet alias repellendus vel, laborum sint ex cupiditate et assumenda temporibus unde.</p>
        </div>

        

      </div>
      <div className='text-4xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>

        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality assurance:</b>
            <p className='text-gray-800'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo modi sed sunt blanditiis sint vero est dicta illo magnam a obcaecati praesentium, impedit quae reiciendis laudantium, voluptates quod temporibus. Eos?</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className='text-gray-800'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo modi sed sunt blanditiis sint vero est dicta illo magnam a obcaecati praesentium, impedit quae reiciendis laudantium, voluptates quod temporibus. Eos?</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Customer Service:</b>
            <p className='text-gray-800'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo modi sed sunt blanditiis sint vero est dicta illo magnam a obcaecati praesentium, impedit quae reiciendis laudantium, voluptates quod temporibus. Eos?</p>
          </div>
        </div>
        <NewsletterBox/>
    </div>
  )
}

export default About
