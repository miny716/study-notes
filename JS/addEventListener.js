/**
 * react合成事件+原生事件
 * 1、父、子div dom的addEventListener设置captrue为false。===>1child listener、3parent listener、2child react dom event、4parent react dom event
 * 备：在响应顺序上，合成事件 晚于 原生事件
 *
 * 2、child react event设置e.stopPropagation()。不会影响原生dom的listener冒泡。===>1child listener、3parent listener、2child react dom event
 * 原因：react合成事件封装的stopPropagation函数在调用的时候，加了一个isPropagationStopped标记，来确认后序的监听器是否执行。
 * 3、child dom listener设置e.stopPropagation()。会影响合成事件冒泡。 ===>1child listener
 * =============
 * 背景：
 * 如果DOM上绑定了过多的事件处理函数，整个【页面响应】以及【内存】占用可能都会受到影响。
 * React为了避免这类DOM事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，实现了一个中间层——SyntheticEvent对象。
 * 是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。
 *
 * 原理：如图
 * React并不是将click事件绑在该div的真实DOM上，而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。
 * 其中，SyntheticEvent 是合并而来。这意味着 SyntheticEvent 对象可能会被重用，事件处理函数执行完后，属性会被清空，所以event的属性无法被异步访问。
 * （React17的事件是注册到root上而非document，这主要是为了渐进升级，避免多版本的React共存的场景中事件系统发生冲突。）
 *
 * 混合使用注意事项：
 * 1、响应顺序
 * 2、阻止冒泡使用
 *
 * 其他：
 * addEventListener第三个参数使用
 *
 * 总之：
 * 1、合成事件的监听器是统一注册在document上的，且仅有冒泡阶段。所以原生事件的监听器响应总是比合成事件的监听器早；
 * 2、阻止原生事件的冒泡后，会阻止合成事件的监听器执行；但阻止合成事件的冒泡后，不会阻止原生事件的监听器执行；
 * 3、event.nativeEvent获取原生事件
 */

import React, { useEffect, useRef } from "react";

const SaasRent = () => {
  const parent = useRef();
  const child = useRef();

  const onParentClickListener = () => {
    console.log("======3parent listener");
  };
  const onChildClickListener = (e) => {
    e && e.stopPropagation();
    console.log("======1child listener");
  };

  useEffect(() => {
    parent.current.addEventListener("click", onParentClickListener, {
      captrue: true, // === useCapture。false(冒泡)，true(捕获)
      once: false, // 单次监听。if true，在单次调用后自动销毁
      passive: false, // 是否让 阻止默认行为preventDefault() 失效。if true，意味着listener永远不会调用preventDefault()方法。
    });
    child.current.addEventListener("click", onChildClickListener, {
      captrue: false,
    });
  }, []);

  const onParentClick = (e) => {
    console.log("======4parent react dom event");
  };

  const onChildClick = (e) => {
    console.log("======2child react dom event");
  };

  return (
    <div className='text-center'>
      <h4 className='offset-t-lg'>欢迎使用达达配送平台</h4>
      <div
        onClick={onParentClick}
        ref={parent}
        style={{ width: "200px", height: "200px", background: "#fff" }}
      >
        <div
          onClick={onChildClick}
          ref={child}
          style={{ width: "100px", height: "30px" }}
        >
          点击
        </div>
      </div>
    </div>
  );
};

export default SaasRent;
