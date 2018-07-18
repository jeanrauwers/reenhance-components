import * as React from 'react';
import { componentFromStream } from 'recompose';
import { from, Observable, combineLatest } from 'rxjs';
import { flatMap, distinctUntilKeyChanged } from 'rxjs/operators';


interface SubjectProp<TInner, TSubjectArgs> {
  subject: (args: TSubjectArgs) => Promise<TInner>;
}

interface ChildrenProp<TInner, TOuter> {
  children: (props: TOuter) => React.ReactElement<TInner>;
}

type OuterProps<TInner, TSubjectArgs> =
  SubjectProp<TInner, TSubjectArgs> & ChildrenProp<SubjectProp<TInner, TSubjectArgs>, TInner>;

type ChildrenType<TInner, TSubjectArgs> = React.ReactElement<SubjectProp<TInner, TSubjectArgs>>;

// spreading generic types are not possible in TS 2.x
// See https://github.com/Microsoft/TypeScript/issues/10727
const merge: <A, B, C>(a: A, b: B, c: C) => A & B & C =
  <A, B, C>(a: A, b: B, c: C) =>
    Object.assign({}, a, b, c) as any;


export const AsyncResolver =
  <TInner, TSubjectArgs = {}>(distinctKey: string = 'subject', initialProps?: TInner) =>
    componentFromStream<OuterProps<TInner, TSubjectArgs> & TSubjectArgs>(
    (props$) => {
      const subject$ = from(props$)
        .pipe(
          distinctUntilKeyChanged(distinctKey),
          flatMap((props: SubjectProp<TInner, TSubjectArgs> & TSubjectArgs) => props.subject(props)),
        );

      return combineLatest<OuterProps<TInner, TSubjectArgs> & TSubjectArgs, TInner, ChildrenType<TInner, TSubjectArgs>>(
        props$,
        subject$,
        (props: OuterProps<TInner, TSubjectArgs> & TSubjectArgs, subject: TInner) =>
          props.children(merge(props, initialProps, subject)),
      );
    });