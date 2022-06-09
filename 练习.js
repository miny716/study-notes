class MyPromise {
  static FULFILLED_STATUS = "fulfilled";
  static PENDIND_STATUS = "pending";
  static REJECTED_STATUS = "rejected";

  constructor(executor) {
    this.promiseResult = null;
    this.promiseState = MyPromise.PENDIND_STATUS;

    this.resolveList = [];
    this.rejectList = [];

    // 需要使用bind绑定this实例，保证resolve函数内使用的this，是实例化对象。因为executor函数中参数执行是在外面，若不绑定this，执行上下文不是实例化对象。
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(res) {
    if (this.promiseState === MyPromise.PENDIND_STATUS) {
      setTimeout(() => {
        this.promiseState = MyPromise.FULFILLED_STATUS;
        this.promiseResult = res;
        if (this.resolveList.length > 0) {
          this.resolveList.forEach((cb) => cb(res));
        }
      });
    }
  }

  reject(err) {
    if (this.promiseState === MyPromise.PENDIND_STATUS) {
      setTimeout(() => {
        this.promiseResult = err;
        this.promiseState = MyPromise.REJECTED_STATUS;
        if (this.rejectList.length > 0) {
          this.rejectList.forEach((cb) => cb(err));
        }
      });
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (res) => res;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    return new MyPromise((resolve, reject) => {
      if (this.promiseState === MyPromise.FULFILLED_STATUS) {
        try {
          const result = onFulfilled(this.promiseResult);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
      if (this.promiseState === MyPromise.REJECTED_STATUS) {
        try {
          const reason = onRejected(this.promiseResult);
          resolve(reason);
        } catch (error) {
          reject(error);
        }
      }
      if (this.promiseState === MyPromise.PENDIND_STATUS) {
        this.resolveList.push((res) => {
          try {
            const result = onFulfilled(res);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        this.rejectList.push((err) => {
          try {
            const reason = onRejected(err);
            resolve(reason);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(cb) {
    return new MyPromise((resolve, reject) => {
      if (this.promiseState === MyPromise.PENDIND_STATUS) {
        this.resolveList.push((res) => {
          try {
            cb();
            resolve(res);
          } catch (error) {
            reject(error);
          }
        });
        this.rejectList.push((res) => {
          try {
            cb();
            resolve(res);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }

  static resolve(res) {
    return new MyPromise((resolve, reject) => resolve(res));
  }

  static reject(err) {
    return new MyPromise((resolve, reject) => reject(err));
  }

  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      let result = [];
      promiseList.forEach((p) => {
        p.then(
          (res) => {
            result.push(res);
            result.length === promiseList.length && resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      let resultList = [];
      promiseList.forEach((p) => {
        p.then(
          (res) => {
            resultList.push({ status: MyPromise.FULFILLED_STATUS, value: res });
            resultList.length === promiseList.length && resolve(resultList);
          },
          (err) => {
            resultList.push({ status: MyPromise.REJECTED_STATUS, value: err });
            resultList.length === promiseList.length && reject(resultList);
          }
        );
      });
    });
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      promiseList.forEach((p) => {
        p.then(
          (res) => resolve(res),
          (err) => reject(err)
        );
      });
    });
  }

  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      let errorList = [];
      promiseList.forEach((p) => {
        p.then(
          (res) => resolve(res),
          (err) => {
            errorList.push(err);
            errorList.length === promiseList.length && reject(err);
          }
        );
      });
    });
  }
}

console.log("======start========");

let p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve p1");
  }, 200);
});

let p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolve p2");
  }, 100);
});

let p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("reject p3");
  }, 500);
});
// .catch((err) => {
//   console.log("=====p3---err---", err);
// });

// let p4 = new MyPromise((resolve, reject) => {
//   reject("reject p4");
// });

MyPromise.allSettled([p1, p2, p3]).then(
  (res) => {
    console.log("all==res====", res);
  },
  (err) => {
    console.log("all==err====", err);
  }
);
console.log("======end=========");
