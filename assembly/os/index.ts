// # OS
//
// <!--introduced_in=v0.10.0-->
//
// > Stability: 2 - Stable
//
// The `os` module provides a number of operating system-related utility methods.
// It can be accessed using:
//
// ```js
// const os = require('os');
// ```
//
// ## os.EOL
// <!-- YAML
// added: v0.7.8
// -->
//
// * {string}
//
// A string constant defining the operating system-specific end-of-line marker:
//
// * `\n` on POSIX
// * `\r\n` on Windows
//
// ## os.arch()
// <!-- YAML
// added: v0.5.0
// -->
//
// * Returns: {string}
//
// The `os.arch()` method returns a string identifying the operating system CPU
// architecture for which the Node.js binary was compiled.
//
// The current possible values are: `'arm'`, `'arm64'`, `'ia32'`, `'mips'`,
// `'mipsel'`, `'ppc'`, `'ppc64'`, `'s390'`, `'s390x'`, `'x32'`, and `'x64'`.
//
// Equivalent to [`process.arch`][].
//
// ## os.constants
// <!-- YAML
// added: v6.3.0
// -->
//
// * {Object}
//
// Returns an object containing commonly used operating system specific constants
// for error codes, process signals, and so on. The specific constants currently
// defined are described in [OS Constants](#os_os_constants_1).
//
// ## os.cpus()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {Object[]}
//
// The `os.cpus()` method returns an array of objects containing information about
// each logical CPU core.
//
// The properties included on each object include:
//
// * `model` {string}
// * `speed` {number} (in MHz)
// * `times` {Object}
//   * `user` {number} The number of milliseconds the CPU has spent in user mode.
//   * `nice` {number} The number of milliseconds the CPU has spent in nice mode.
//   * `sys` {number} The number of milliseconds the CPU has spent in sys mode.
//   * `idle` {number} The number of milliseconds the CPU has spent in idle mode.
//   * `irq` {number} The number of milliseconds the CPU has spent in irq mode.
//
// <!-- eslint-disable semi -->
// ```js
// [
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 252020,
//       nice: 0,
//       sys: 30340,
//       idle: 1070356870,
//       irq: 0
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 306960,
//       nice: 0,
//       sys: 26980,
//       idle: 1071569080,
//       irq: 0
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 248450,
//       nice: 0,
//       sys: 21750,
//       idle: 1070919370,
//       irq: 0
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 256880,
//       nice: 0,
//       sys: 19430,
//       idle: 1070905480,
//       irq: 20
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 511580,
//       nice: 20,
//       sys: 40900,
//       idle: 1070842510,
//       irq: 0
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 291660,
//       nice: 0,
//       sys: 34360,
//       idle: 1070888000,
//       irq: 10
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 308260,
//       nice: 0,
//       sys: 55410,
//       idle: 1071129970,
//       irq: 880
//     }
//   },
//   {
//     model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
//     speed: 2926,
//     times: {
//       user: 266450,
//       nice: 1480,
//       sys: 34920,
//       idle: 1072572010,
//       irq: 30
//     }
//   }
// ]
// ```
//
// Because `nice` values are UNIX-specific, on Windows the `nice` values of all
// processors are always 0.
//
// ## os.endianness()
// <!-- YAML
// added: v0.9.4
// -->
//
// * Returns: {string}
//
// The `os.endianness()` method returns a string identifying the endianness of the
// CPU *for which the Node.js binary was compiled*.
//
// Possible values are:
//
// * `'BE'` for big endian
// * `'LE'` for little endian.
//
// ## os.freemem()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {integer}
//
// The `os.freemem()` method returns the amount of free system memory in bytes as
// an integer.
//
// ## os.getPriority([pid])
// <!-- YAML
// added: v10.10.0
// -->
//
// * `pid` {integer} The process ID to retrieve scheduling priority for.
//   **Default** `0`.
// * Returns: {integer}
//
// The `os.getPriority()` method returns the scheduling priority for the process
// specified by `pid`. If `pid` is not provided, or is `0`, the priority of the
// current process is returned.
//
// ## os.homedir()
// <!-- YAML
// added: v2.3.0
// -->
//
// * Returns: {string}
//
// The `os.homedir()` method returns the home directory of the current user as a
// string.
//
// ## os.hostname()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {string}
//
// The `os.hostname()` method returns the hostname of the operating system as a
// string.
//
// ## os.loadavg()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {number[]}
//
// The `os.loadavg()` method returns an array containing the 1, 5, and 15 minute
// load averages.
//
// The load average is a measure of system activity, calculated by the operating
// system and expressed as a fractional number. As a rule of thumb, the load
// average should ideally be less than the number of logical CPUs in the system.
//
// The load average is a UNIX-specific concept with no real equivalent on
// Windows platforms. On Windows, the return value is always `[0, 0, 0]`.
//
// ## os.networkInterfaces()
// <!-- YAML
// added: v0.6.0
// -->
//
// * Returns: {Object}
//
// The `os.networkInterfaces()` method returns an object containing only network
// interfaces that have been assigned a network address.
//
// Each key on the returned object identifies a network interface. The associated
// value is an array of objects that each describe an assigned network address.
//
// The properties available on the assigned network address object include:
//
// * `address` {string} The assigned IPv4 or IPv6 address
// * `netmask` {string} The IPv4 or IPv6 network mask
// * `family` {string} Either `IPv4` or `IPv6`
// * `mac` {string} The MAC address of the network interface
// * `internal` {boolean} `true` if the network interface is a loopback or
//   similar interface that is not remotely accessible; otherwise `false`
// * `scopeid` {number} The numeric IPv6 scope ID (only specified when `family`
//   is `IPv6`)
// * `cidr` {string} The assigned IPv4 or IPv6 address with the routing prefix
//   in CIDR notation. If the `netmask` is invalid, this property is set
//   to `null`.
//
// <!-- eslint-skip -->
// ```js
// {
//   lo: [
//     {
//       address: '127.0.0.1',
//       netmask: '255.0.0.0',
//       family: 'IPv4',
//       mac: '00:00:00:00:00:00',
//       internal: true,
//       cidr: '127.0.0.1/8'
//     },
//     {
//       address: '::1',
//       netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
//       family: 'IPv6',
//       mac: '00:00:00:00:00:00',
//       scopeid: 0,
//       internal: true,
//       cidr: '::1/128'
//     }
//   ],
//   eth0: [
//     {
//       address: '192.168.1.108',
//       netmask: '255.255.255.0',
//       family: 'IPv4',
//       mac: '01:02:03:0a:0b:0c',
//       internal: false,
//       cidr: '192.168.1.108/24'
//     },
//     {
//       address: 'fe80::a00:27ff:fe4e:66a1',
//       netmask: 'ffff:ffff:ffff:ffff::',
//       family: 'IPv6',
//       mac: '01:02:03:0a:0b:0c',
//       scopeid: 1,
//       internal: false,
//       cidr: 'fe80::a00:27ff:fe4e:66a1/64'
//     }
//   ]
// }
// ```
//
// ## os.platform()
// <!-- YAML
// added: v0.5.0
// -->
//
// * Returns: {string}
//
// The `os.platform()` method returns a string identifying the operating system
// platform as set during compile time of Node.js.
//
// Currently possible values are:
//
// * `'aix'`
// * `'darwin'`
// * `'freebsd'`
// * `'linux'`
// * `'openbsd'`
// * `'sunos'`
// * `'win32'`
//
// Equivalent to [`process.platform`][].
//
// The value `'android'` may also be returned if the Node.js is built on the
// Android operating system. However, Android support in Node.js is considered
// [to be experimental][Android building] at this time.
//
// ## os.release()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {string}
//
// The `os.release()` method returns a string identifying the operating system
// release.
//
// On POSIX systems, the operating system release is determined by calling
// [uname(3)][]. On Windows, `GetVersionExW()` is used. Please see
// https://en.wikipedia.org/wiki/Uname#Examples for more information.
//
// ## os.setPriority([pid, ]priority)
// <!-- YAML
// added: v10.10.0
// -->
//
// * `pid` {integer} The process ID to set scheduling priority for.
//   **Default** `0`.
// * `priority` {integer} The scheduling priority to assign to the process.
//
// The `os.setPriority()` method attempts to set the scheduling priority for the
// process specified by `pid`. If `pid` is not provided, or is `0`, the priority
// of the current process is used.
//
// The `priority` input must be an integer between `-20` (high priority) and `19`
// (low priority). Due to differences between Unix priority levels and Windows
// priority classes, `priority` is mapped to one of six priority constants in
// `os.constants.priority`. When retrieving a process priority level, this range
// mapping may cause the return value to be slightly different on Windows. To avoid
// confusion, it is recommended to set `priority` to one of the priority constants.
//
// On Windows setting priority to `PRIORITY_HIGHEST` requires elevated user,
// otherwise the set priority will be silently reduced to `PRIORITY_HIGH`.
//
// ## os.tmpdir()
// <!-- YAML
// added: v0.9.9
// changes:
//   - version: v2.0.0
//     pr-url: https://github.com/nodejs/node/pull/747
//     description: This function is now cross-platform consistent and no longer
//                  returns a path with a trailing slash on any platform
// -->
//
// * Returns: {string}
//
// The `os.tmpdir()` method returns a string specifying the operating system's
// default directory for temporary files.
//
// ## os.totalmem()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {integer}
//
// The `os.totalmem()` method returns the total amount of system memory in bytes
// as an integer.
//
// ## os.type()
// <!-- YAML
// added: v0.3.3
// -->
//
// * Returns: {string}
//
// The `os.type()` method returns a string identifying the operating system name
// as returned by [uname(3)][]. For example, `'Linux'` on Linux, `'Darwin'` on
// macOS, and `'Windows_NT'` on Windows.
//
// Please see https://en.wikipedia.org/wiki/Uname#Examples for additional
// information about the output of running [uname(3)][] on various operating
// systems.
//
// ## os.uptime()
// <!-- YAML
// added: v0.3.3
// changes:
//   - version: v10.0.0
//     pr-url: https://github.com/nodejs/node/pull/20129
//     description: The result of this function no longer contains a fraction
//                  component on Windows.
// -->
//
// * Returns: {integer}
//
// The `os.uptime()` method returns the system uptime in number of seconds.
//
// ## os.userInfo([options])
// <!-- YAML
// added: v6.0.0
// -->
//
// * `options` {Object}
//   * `encoding` {string} Character encoding used to interpret resulting strings.
//     If `encoding` is set to `'buffer'`, the `username`, `shell`, and `homedir`
//     values will be `Buffer` instances. **Default:** `'utf8'`.
// * Returns: {Object}
//
// The `os.userInfo()` method returns information about the currently effective
// user — on POSIX platforms, this is typically a subset of the password file. The
// returned object includes the `username`, `uid`, `gid`, `shell`, and `homedir`.
// On Windows, the `uid` and `gid` fields are `-1`, and `shell` is `null`.
//
// The value of `homedir` returned by `os.userInfo()` is provided by the operating
// system. This differs from the result of `os.homedir()`, which queries several
// environment variables for the home directory before falling back to the
// operating system response.
//
// Throws a [`SystemError`][] if a user has no `username` or `homedir`.
