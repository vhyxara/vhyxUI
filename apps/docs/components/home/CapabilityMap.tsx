'use client';

import React from 'react';
import { VhyxChart } from '@vhyxchart/react';

const SOURCE = `flowchart LR
  page([Settings page])
  save["save-changes<br/>medium"]:::info
  del["delete-account<br/>critical"]:::danger
  confirm{"A person confirms"}:::warning
  done([Done]):::success
  page --> save --> done
  page --> del --> confirm --> done

scenario An agent works through the page
  page -> save : update-profile
  save is done
  page -> del : delete-account
  del is warn
  caption Critical action — the agent stops and asks
  del -> confirm : ask a person
  confirm is done
  confirm -> done
  done is done
`;

/** The settings page's manifest drawn as an animated VhyxChart flow. */
export function CapabilityMap(): React.ReactElement {
  return <VhyxChart source={SOURCE} autoplay controls layout="plain" />;
}
