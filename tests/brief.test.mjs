import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBrief,formatBrief} from '../lib/brief.ts';
const valid={name:'Alex Taylor',email:'alex@gmail.com',services:['Website Design'],message:'A responsive website for our independent business.',privacy:true};
test('accepts personal email, deduplicates services, and preserves brief content',()=>{const {value,errors}=validateBrief({...valid,services:['Website Design','Website Design']});assert.deepEqual(errors,{});assert.equal(value.services.length,1);assert.match(formatBrief(value),/alex@gmail.com/);});
test('rejects missing consent, short message and forged services',()=>{const {errors}=validateBrief({...valid,privacy:false,message:'Hello',services:['Fake service']});assert.ok(errors.privacy);assert.ok(errors.message);assert.ok(errors.services);});
test('rejects overlong payload fields and malformed email',()=>{const {errors}=validateBrief({...valid,name:'a'.repeat(121),email:'bad@',message:'a'.repeat(6001)});assert.ok(errors.name);assert.ok(errors.email);assert.ok(errors.message);});
test('handles null and non-string input without crashing',()=>{assert.ok(validateBrief(null).errors.name);assert.ok(validateBrief({...valid,email:{},services:'Website Design'}).errors.services);});
test('rejects invalid calendar dates without throwing',()=>{assert.ok(validateBrief({...valid,deadline:'2026-99-99'}).errors.deadline);assert.ok(validateBrief({...valid,deadline:'2026-02-31'}).errors.deadline);});
