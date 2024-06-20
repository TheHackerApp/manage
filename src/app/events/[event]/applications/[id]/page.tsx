'use client';

import { faTriangleExclamation } from '@fortawesome/pro-duotone-svg-icons';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

import DateTime from '@/components/DateTime';
import Status from '@/components/Status';
import { ApplicationStatus, Education, Gender, RaceEthnicity, Referrer } from '@/graphql';

import ChangeStatus from './_components/ChangeStatus';
import Group from './_components/Group';
import Row from './_components/Row';
import { useApplicationDetailSuspenseQuery } from './ApplicationDetail.graphql';

interface Props {
  params: {
    event: string;
    id: string;
  };
}

const Application = ({ params: { event, id: rawId } }: Props): ReactNode => {
  const id = parseInt(rawId);
  const { data } = useApplicationDetailSuspenseQuery({ variables: { id }, context: { event } });

  const application = data.application!;
  const user = application.participant.user;

  return (
    <div className="space-y-2 max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {user.givenName} {user.familyName}&apos;s Application
          {application.flagged && (
            <FontAwesomeIcon icon={faTriangleExclamation} className="ml-2 text-warning h-5 w-5" />
          )}
        </h2>
        <Status status={application.status} />
      </div>
      <div className="space-y-4">
        <Group name="About">
          <Row label="Gender" value={application.gender} render={(value) => GENDER_NAMES[value]} />
          <Row
            label="Race / Ethnicity"
            value={application.raceEthnicity}
            render={(value) => RACE_ETHNICITY_NAMES[value]}
          />
          <Row
            label="Birthday"
            value={application.dateOfBirth}
            render={(value) => <DateTime value={value} time={false} />}
          />
          <Row
            label="How'd you hear about us?"
            value={application.referrer}
            render={(value) => REFERRER_NAMES[value]}
          />
        </Group>
        <Group name="Education">
          <Row label="School" value={application.school?.name} />
          <Row label="Graduation year" value={application.graduationYear} />
          <Row label="Level of study" value={application.education} render={(value) => EDUCATION_NAMES[value]} />
          <Row label="Major" value={application.major} />
        </Group>
        <Group name="Experience">
          <Row label="GitHub / GitLab / BitBucket URL" value={application.vcsUrl} render={asLink} />
          <Row label="Portfolio URL" value={application.portfolioUrl} render={asLink} />
          <Row label="Devpost URL" value={application.devpostUrl} render={asLink} />
          <Row label="Hackathons attended" value={application.hackathonsAttended} />
          <Row
            label="Share profile with sponsors/partners?"
            value={application.shareInformation}
            render={(value) => (value ? 'Yes' : 'No')}
          />
        </Group>
        <Group name="Shipping">
          <Row label="Address line 1" value={application.address.line1} />
          <Row label="Address line 2" value={application.address.line2} />
          <Row label="Address line 3" value={application.address.line3} />
          <Row label="City" value={application.address.locality} />
          <Row label="State / Province" value={application.address.administrativeArea} />
          <Row label="Postal Code" value={application.address.postalCode} />
          <Row label="Country" value={application.address.country} />
        </Group>
        <Group name="Organizer-only Information">
          {!(
            application.status === ApplicationStatus.Accepted || application.status === ApplicationStatus.Rejected
          ) && <ChangeStatus id={id} event={event} current={application.status} />}
        </Group>
      </div>
      <Button
        as={Link}
        href={`/events/${event}/applications`}
        variant="flat"
        startContent={<FontAwesomeIcon icon={faArrowLeft} className="text-default-500 h-5 w-5" />}
      >
        Back
      </Button>
    </div>
  );
};

const asLink = (url: string): ReactNode => (
  <Link href={url} target="_blank" rel="noreferrer noopener" className="text-blue-400 hover:underline">
    {url}
  </Link>
);

const GENDER_NAMES: Record<Gender, string> = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.NonBinary]: 'Non-binary',
  [Gender.Other]: 'Other',
};

const RACE_ETHNICITY_NAMES: Record<RaceEthnicity, string> = {
  [RaceEthnicity.AsianIndian]: 'Asian Indian',
  [RaceEthnicity.Black]: 'Black or African',
  [RaceEthnicity.Chinese]: 'Chinese',
  [RaceEthnicity.Filipino]: 'Filipino',
  [RaceEthnicity.Guamanian]: 'Guamanian or Chamorro',
  [RaceEthnicity.Hispanic]: 'Hispanic / Latino / Spanish Origin',
  [RaceEthnicity.Japanese]: 'Japanese',
  [RaceEthnicity.Korean]: 'Korean',
  [RaceEthnicity.MiddleEastern]: 'Middle Eastern',
  [RaceEthnicity.NativeAmerican]: 'Native American or Alaskan Native',
  [RaceEthnicity.NativeHawaiian]: 'Native Hawaiian',
  [RaceEthnicity.Samoan]: 'Samoan',
  [RaceEthnicity.Vietnamese]: 'Vietnamese',
  [RaceEthnicity.White]: 'White',
  [RaceEthnicity.OtherAsian]: 'Other Asian (Thai, Cambodian, etc.)',
  [RaceEthnicity.OtherPacificIslander]: 'Other Pacific Islander',
  [RaceEthnicity.Other]: 'Other',
};

const EDUCATION_NAMES: Record<Education, string> = {
  [Education.BelowSecondary]: 'Less than Secondary / High School',
  [Education.Secondary]: 'Secondary / High School',
  [Education.UndergraduateTwoYear]: 'Undergraduate University (2 year)',
  [Education.UndergraduateThreeYearPlus]: 'Undergraduate University (3+ year)',
  [Education.Graduate]: 'Graduate University (Masters, Doctoral, etc.)',
  [Education.Bootcamp]: 'Code School / Bootcamp',
  [Education.Vocational]: 'Other Vocational / Trade Program or Apprenticeship',
  [Education.Other]: 'Other',
  [Education.NonStudent]: "I'm not currently a student",
};

const REFERRER_NAMES: Record<Referrer, string> = {
  [Referrer.Search]: 'Search engine (Google, Bing, etc.)',
  [Referrer.Peer]: 'Friend or colleague',
  [Referrer.SocialMedia]: 'Social media (Instagram, TikTok, etc.)',
  [Referrer.Advertisement]: 'Advertisement',
  [Referrer.Blog]: 'Blog or article',
  [Referrer.StudentOrganization]: 'Student organization or clob',
  [Referrer.School]: 'School or university',
  [Referrer.Other]: 'Other',
};

export default Application;
