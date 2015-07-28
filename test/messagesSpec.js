// jscs:disable maximumLineLength

describe("messages", function () {
    it("can pass simple values (String, Number, Boolean, Object, Array, null, undefined, NaN) between the main thread and the worker", function (done) {
        var callbacks = {
            done: function (values) {
                expect(values.length).toEqual(9);
                expect(values[0]).toBe("test");
                expect(values[1]).toBe(42);
                expect(values[2]).toBe(true);
                expect(values[3]).toBe(false);

                expect(values[4].length).toEqual(2);
                expect(values[4][0]).toBe(1);
                expect(values[4][2]).toBe(2);

                expect(values[5].a).toBe(1);
                expect(values[5].b).toBe(2);

                expect(values[6]).toBe(null);
                expect(values[7]).toBe(undefined);
                expect(values[8]).toBeNaN();
            },
            failed: function () {},
            terminated: function () {
                expect(callbacks.done).toHaveBeenCalled();
                expect(callbacks.failed).not.toHaveBeenCalled();
                expect(callbacks.terminated).toHaveBeenCalled();
                done();
            }
        };

        spyOn(callbacks, "done");
        spyOn(callbacks, "failed");
        spyOn(callbacks, "terminated").and.callThrough();

        var fn = threadify(function () {
            var args = [];

            for (var i = 0 ; i < arguments.length ; i++) {
                args.push(arguments[i]);
            }

            return args;
        });

        var job = fn("test", 42, true, false, [1, 2], {a: 1, b: 2}, null, undefined, NaN);

        job.done = callbacks.done;
        job.failed = callbacks.failed;
        job.terminated = callbacks.terminated;
    });

    it("can pass mathematical values/const (Infinity, Math.PI, Math.E) between the main thread and the worker", function (done) {
        var callbacks = {
            done: function () {},
            failed: function () {},
            terminated: function () {
                expect(callbacks.done).toHaveBeenCalledWith([Infinity, Math.PI, Math.E]);
                expect(callbacks.failed).not.toHaveBeenCalled();
                expect(callbacks.terminated).toHaveBeenCalled();
                done();
            }
        };

        spyOn(callbacks, "done");
        spyOn(callbacks, "failed");
        spyOn(callbacks, "terminated").and.callThrough();

        var fn = threadify(function () {
            var args = [];

            for (var i = 0 ; i < arguments.length ; i++) {
                args.push(arguments[i]);
            }

            return args;
        });

        var job = fn(Infinity, Math.PI, Math.E);

        job.done = callbacks.done;
        job.failed = callbacks.failed;
        job.terminated = callbacks.terminated;
    });

    it("can pass Error objects between the main thread and the worker", function (done) {
        var obj = new Error("test-error");

        var callbacks = {
            done: function () {},
            failed: function () {},
            terminated: function () {
                expect(callbacks.done).toHaveBeenCalledWith(obj);
                expect(callbacks.failed).not.toHaveBeenCalled();
                expect(callbacks.terminated).toHaveBeenCalled();
                done();
            }
        };

        spyOn(callbacks, "done");
        spyOn(callbacks, "failed");
        spyOn(callbacks, "terminated").and.callThrough();

        var fn = threadify(function (a) {
            return a;
        });

        var job = fn(obj);

        job.done = callbacks.done;
        job.failed = callbacks.failed;
        job.terminated = callbacks.terminated;
    });
});

// jscs:enable
