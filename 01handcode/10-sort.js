var swap = function (arr, i, j) {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

var sortArray = function (nums) {
    // // 1、冒泡排序
    // for(let i = 0 ; i < nums.length; i++){
    //     for(let j = 0; j < nums.length-1-i; j++){
    //         if(nums[j] > nums[j+1]){
    //             swap(nums,j,j+1)
    //         }
    //     }
    // }
    // return nums

    // 2、插入排序
    // let currentValue
    // for (let i = 0; i < nums.length - 1; i++) {
    //     let preIndex = i
    //     currentValue = nums[preIndex + 1]

    //     while (preIndex >= 0 && currentValue < nums[preIndex]) {
    //         nums[preIndex + 1] = nums[preIndex]
    //         preIndex--
    //     }

    //     nums[preIndex + 1] = currentValue
    // }
    // return nums

    // 3、选择排序
    // let minIndex
    // for (let i = 0; i < nums.length; i++) {
    //     minIndex = i
    //     for (let j = i + 1; j < nums.length; j++) {
    //         if (nums[j] < nums[minIndex]) {
    //             minIndex = j
    //         }
    //     }
    //     swap(nums, minIndex, i)
    // }
    // return nums

    // 4、快速排序
    // function partition(arr, start, end) {
    //     if (start === end) return arr

    //     let pivot = start // 基准数
    //     let zoneIndex = pivot - 1 // 分区指示器
    //     swap(arr, pivot, end)

    //     for (let i = start; i <= end; i++) {
    //         if (nums[i] <= nums[end]) {
    //             zoneIndex++
    //             // 理解
    //             if (i > zoneIndex) {
    //                 swap(nums, i, zoneIndex)
    //             }
    //         }
    //     }
    //     return zoneIndex
    // }

    // function quickSort(arr, start, end) {
    //     if (arr.length <= 0 || start < 0 || end >= arr.length || start >= end) return arr

    //     let zoneIndex = partition(nums, start, end)

    //     if (start < zoneIndex) quickSort(arr, start, zoneIndex - 1)
    //     if (end > zoneIndex) quickSort(arr, zoneIndex + 1, end)
    //     return arr
    // }

    // return quickSort(nums, 0, nums.length - 1)

    // 5、归并排序（合并两个有序数组）
    // function merge(left, right) {
    //     const result = new Array(left.length + right.length)

    //     for (let index = 0, i = 0, j = 0; index < result.length; index++) {
    //         if (i >= left.length) {
    //             result[index] = right[j++]
    //         }
    //         else if (j >= right.length) {
    //             result[index] = left[i++]
    //         }
    //         else if (left[i] < right[j]) {
    //             result[index] = left[i++]
    //         }
    //         else {
    //             result[index] = right[j++]
    //         }
    //     }
    //     return result
    // }

    // if (nums.length < 2) return nums

    // let mid = Math.floor(nums.length / 2)
    // let left = nums.slice(0, mid)
    // let right = nums.slice(mid)

    // return merge(sortArray(left), sortArray(right))

    // 6、堆排序
    let length = nums.length // 全局使用，并递减。adjustHeap/buildMaxHeap也使用
    if (length < 1) return nums

    // 构建一个最大堆
    buildMaxHeap(nums)
    while (length > 0) {
        // 交换最大值[0]与最后一个元素
        swap(nums, 0, length - 1)
        length--
        adjustHeap(nums, 0) // 调整最大堆
    }
    return nums

    function adjustHeap(nums, i) {
        let maxIndex = i;
        let left = 2 * i + 1
        let right = 2 * (i + 1)
        if (left < length && nums[left] > nums[maxIndex]) {
            maxIndex = left
        }
        if (right < length && nums[right] > nums[left] && nums[right] > nums[maxIndex]) {
            maxIndex = right
        }
        if (maxIndex !== i) {
            swap(nums, maxIndex, i)
            adjustHeap(nums, maxIndex)
        }
    }

    function buildMaxHeap(nums) {
        // 从最后一个非叶节点，向上构建最大堆
        for (let i = Math.floor(length / 2 - 1); i >= 0; i--) {
            adjustHeap(nums, i) // 将父节点为i的二叉树调整为一个二叉堆
        }
    }
};