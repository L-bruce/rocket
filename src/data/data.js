// import Rocket_video from '@/src/video/rocket.mp4'
export const image =
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fc229b2d5-f800-4c02-97a9-dbe2c5a26288%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1686647949&t=6c7c9cb31af7798df0c49c461c74319b'

export const data_rocket = {
    src: image,
    title: 'rocket-Elon Musk',
    id: Math.ceil(Math.random() * 100000),
    date: 'April 06 2023',
    content:
        '埃隆·里夫·马斯克（Elon Reeve Musk），1971年6月28日出生于南非的行政首都比勒陀利亚，兼具美国、南非、加拿大三重国籍，企业家、工程师、发明家、慈善家、特斯拉（TESLA）创始人兼首席执行官 [73] [151] 、太空探索技术公司（SpaceX）首席执行官兼首席技术官、太阳城公司（SolarCity）董事会主席 [2-3]、推特首席执行官 [183] 、美国国家工程院院士 [96] 、英国皇家学会院士 [39] 、OpenAI联合创始人 [184] ，本科毕业于宾夕法尼亚大学经济学和物理学双专业 [1] 。',
}

export const getDetail = () => {
    return data_rocket
}

const getData = () => {
    let arr = Array.from(new Array(12).keys())
    arr.forEach((item, index) => {
        if (index <= 11) {
            arr[index] = data_rocket
        }
    })
    return arr
}

export default getData
